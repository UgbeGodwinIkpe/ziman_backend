const Query=require("../models/query")
// create restaurant controller
exports.raiseQuery = async (req, res) => {
    try {
        const { subject, message} = req.body;
        const restaurantId=req.params.id
        const email=req.user?.email
        
        if (!subject || !message){
          return res.status(401).json({ message: 'Query subject and message cannot be empty!' });
        } 
        const query = await Query.create({
            from:restaurantId, email, subject, message
        });
        console.log({"Res":query})
        res.status(203).json({query, message: 'Query successfully submiited' });
    } catch (error) {
        console.log(error)
        // res.status(501).json({error:"Something went wrong!"})
        
    }
};