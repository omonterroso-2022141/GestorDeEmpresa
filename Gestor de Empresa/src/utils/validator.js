import { hash, compare } from 'bcrypt'

export const encryt = async(password)=>{
    try{
        return await hash(password, 5)
    }catch(err){
        console.error(err)
        return err   
    }
}

export const checkPassword = async(password, hash)=>{
    try{
        return await compare(password, hash)
    }catch(err){
        console.error(err)
        return err   
    }
}

export const checkUpdate = (data, entity)=>{
    if(entity == 'admin'){
        if(
            Object.entries(data).length == 0
        )return false
        return true
    }else if(entity == 'company'){
        if(
            Object.entries(data).length == 0
        )return false
        return true
    }else{
        return false
    }
}