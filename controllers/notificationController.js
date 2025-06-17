const Notification=require("../models/notification")
// create restaurant controller
exports.createNotification = async (req, res) => {
    try {
        const { to, title, message} = req.body;
        if (!to || !title || !message){
          return res.status(401).json({ message: 'All fields are required!' });
        } 
        const notification = await Notification.create({
            user:to, title, message
        });
        console.log({"Res":notification})
        res.status(203).json({notifications:notification, message: `Notification has been sent to all ${to}` });
    } catch (error) {
        console.log(error)
        res.status(501).json({error:"Something went wrong!"})
        
    }
};

exports.fetchNotifications=async(req, res)=>{
   try {
    // users: { $in: ['Restaurant', 'Both'] }
    const notifications=await Notification.find({users:{ $in: [req.params.user, 'Both'] }}).sort({ createdAt: -1 });
    if(!notifications) return res.status(301).json({ notifications:[]});
    res.status(200).json({notifications});
    
   } catch (error) {
    console.log(error)
    res.status(501).json({error:"Something went wrong!"})
    
   }


};