const buyerProfile = async(req,res) =>{
    const userEmail = req.user.email;
    const role = req.user.role;
    const phone = req.user.phone;

res.render("buyer/profile",{userEmail,role,phone})
}


module.exports = buyerProfile