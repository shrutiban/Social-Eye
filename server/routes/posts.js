// const { delete } = require("..");

const router=require("express").Router();
const Post = require("../models/posts")


// router.get("/",(res,req)=>{
//     console.log("post page");
// })
//create

router.post("/",async(req,res)=>{
    console.log("inside post");
    const newPost=new Post(req.body);
    try{
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);

    }
    catch(err){
        res.status(500).json(err)
    }
})
//donate and not donate

router.put("/:id/donates",async(req,res)=>{
    console.log("inside put");
    try{
        
        const dpost= await Post.findById(req.params.id);
        if(dpost!=null&&!dpost.donate.includes(req.body.userId)){
             await dpost.updateOne({$push:{donate: req.body.userId}});
             res.status(200)
             res.json("This post got Donation");
        }
        else{
            await dpost.updateOne({$pull:{donate: req.body.userId}});
            res.status(200)
            res.json("This post not got Donation");
        }

    }
    catch(err){
        res.json(500).json(err);
    }
});
// delete
// donate to posts
// get a post

router.get("/:id", async(req,res)=>{
    console.log("inside get");
    try{
        console.log("inside try");
        const post=await Post.findById(req.params.id);
        res.status(200);
        res.json(post);

    }
    catch(err){
        console.log("inside catch");
        res.status(500).json(err)

    }
});
// get all posts
router.get ("/timeline/all",async(req,res)=>{
    // let postArray=[];
    console.log("Hello");
    try{
        console.log("try");
        // const currentUser = await User.findById(req.body.userId);
        // console.log(currentUser);
        // // const userPosts=await Post.find({userId: currentUser._id});
        // const postArray=await Post.find({})
        // array.forEach(element => {
        //     console.log(postArray[element]);
        // });
        Post.find({},(err,post)=>{
            var postMap={};
            post.forEach(function(posts){
                postMap[post._id]=post;
            })
            res.status(200).json(postMap);
        })
        
        
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports=router;