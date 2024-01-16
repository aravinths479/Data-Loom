exports.home = (req,res)=>{
    console.log(req.user);
    return res.json({msg:"hai"});
}