const Hashtag = require("../models").Hashtag;
const Post = require("../models").Post;
const Posthashtag = require("../models").Posthashtag;


async function addHashtag(post){
  const desc = post.description.split(' ')
  const regex = new RegExp('^#');
  const descFiltered = desc.filter( word => word.match(regex))

  let hashtagList = [];

  descFiltered.map(hashtag => {
    hashtag.split('#')
      .filter(hashtag => hashtag.length > 0)
      .map(hashtag => {
        hashtagList.push(hashtag)
      })
  })
  try {
   return await hashtagList.map(hashtag => {
      Hashtag.findOrCreate({
        where:{
          hashtag: hashtag
        },
        default:{
          hashtag: hashtag
        }
      })
        .then(([ hashtag, created]) => {
          Posthashtag.create({
            PostId: post.id,
            HashtagId: hashtag.id
          })
        })
        .catch(err => console.log(err))
    })
  } catch (error) {
    console.log(error)
  }

}

module.exports = {
  addHashtag,
};
