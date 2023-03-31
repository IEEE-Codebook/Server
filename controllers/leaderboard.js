const axios = require("axios");
const Leaderboard = require("../models/leaderboard.js");
const user = require("../models/user.js");

const getCodeforcesRating = async (handle) => {
    const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
    try {
      const response = await axios.get(url);
  
      const data = response.data.result;
      if (data.length === 0) {
        return 0;
      }
      const latestRating = data[data.length - 1].newRating;
      return latestRating;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };
  
  const getAtCoderRating = async (handle) => {
    console.log(handle)
    const url = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/rated_point_sum_rank?user=${handle}`;
    try {
      const response = await axios.get(url);
      console.log(response)
      const data = response.data.rank;
      console.log(data)
      return data;
    } catch(err) {
      console.log(err);
      return 0;
    }
  }

  const leaderboard = async (req, res) => {
    const platform = req.query.platform;
    if(platform == "codeforces") {
      try {
        let lb = await user.find({codeforces: {$exists: true}});
        console.log(lb[0]["codeforces"])
        for (let i = 0; i < lb.length; i++) {
          if((await Leaderboard.find({username: lb[i]["codeforces"], platform: "codeforces"})).length == 0){
            // console.log(lb[i])
            const rating = await getCodeforcesRating(lb[i]["codeforces"]);
            const leader = new Leaderboard({
              username: lb[i]["codeforces"],
              platform: "codeforces",
              score: rating
            })
            await leader.save();
          }
        }     
        const sortedLeaderboard = await Leaderboard.find({"platform":"codeforces"}).sort({score: -1});
        res.status(200).json({sortedLeaderboard: sortedLeaderboard});
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    }
    
    else if(platform == "atcoder") {
      try {
        let lb = await user.find({atcoder: {$exists: true, }});
        Leaderboard.remove()
        for (let i = 0; i < lb.length; i++) {
          if((await Leaderboard.find({username: lb[i]["atcoder"], platform: "atcoder"})).length == 0 ){
            
            const rating = await getAtCoderRating(lb[i]["atcoder"]);
            const leader = new Leaderboard({
              username: lb[i]["atcoder"],
              platform: "atcoder",
              score: rating
            })
            
            await leader.save();
          }
        }  
        const sortedLeaderboard = await Leaderboard.find({"platform":"atcoder"}).sort({score: -1});
        // console.log(sortedLeaderboard)
        res.status(200).json({sortedLeaderboard: sortedLeaderboard});
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    }
}

module.exports = {leaderboard};