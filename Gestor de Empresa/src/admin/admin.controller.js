'use strinct'
import { encryt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'



import Admin from './admin.model.js'

export const register = async(req, res)=>{
    try{
        let data = req.body
        if(!data) return res.status(400).send({message: 'Data were not sent'})
        data.password = await encryt(data.password)
        let admin = new Admin(data)
        await admin.save()
        return res.send({message: 'The user Administrator has been saved'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'System Error'}) 
    }
}

export const login = async(req, res)=>{
    try{
        let { userAdmin, password, email} = req.body
        let admin = await Admin.findOne({
            $or: [
                {userAdmin: userAdmin}
            ]
        })
        if(userAdmin && await checkPassword(password, admin.password)){
            let loggerdAdmin = {
                uid: admin.id,
                userAdmin: admin.userAdmin,
                name: admin.name,
            }
            let token = await generateJwt(loggerdAdmin)
            return res.send({message: `Welcome ${admin.name}`,loggerdAdmin,token})
        }
        return res.status(401).send({message: 'Check your data again'})   
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'System Error'}) 
    }
}

export const update = async(req, res)=>{
    try{
        let { uid } = req.admin
        let { id } = req.params
        let data = req.body
        let updateVerify = checkUpdate(data, 'admin')

        if(!updateVerify) 
            return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missing data'})
        
        if(data.newPassword)
            if(!data.actualPassword)
                return res.status(400).send({message: 'Please enter your current password '})
            else{
                let adminCheck = await Admin.findOne({_id: uid})
                if(!await checkPassword(data.actualPassword, adminCheck.password))
                    return res.status(400).send({message: 'Check your data again'})
                data.password = await encryt(data.newPassword)
            }

        if(uid != id) 
            return res.status(403).send({message: 'You cannot edit other administrators'})

        let updateAdmin = await Admin.findOneAndUpdate(
            {_id: id},
            data,
            {new: true})

        if(!updateAdmin) 
            return res.status(401).send({message: 'Admin not update'})
        
        return res.send({message: 'Updated Admin', updateAdmin})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'System Error'}) 
    }
}
