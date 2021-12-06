export const canWriteFile = (file,user)=>{
    // console.log("canWriteFile: ", file, user)

    if (!user || !file){
        return false
    }

    file.writeACL=file.writeACL||[]
    file.readACL=file.readACL||[]
    file.computeACL=file.computeACL||[]


    // owner can write
    if (file.owner_id===user.id){
        return true
    }

    // superadmin can write
    if (user.role.indexOf("superadmin")>=0){
        return true
    }

    // writeACL user can write
    if (file.writeACL.indexOf(user.id)>=0){
        return true
    }

    // team can write
    if (user.teams.some((team)=>{
        return file.writeACL.indexOf(`#${team}`)>=0
    })){
        return true
    }

    return false
}

export const canWriteFiles = (files,user)=>{
    if (files.some((f)=>{
        return !canWriteFile(f,user)
    })){
        return false
    }
    return true
}

export const canDownloadFile = (file,user)=>{
    if (!file){
        return false
    }

    file.writeACL=file.writeACL||[]
    file.readACL=file.readACL||[]
    file.computeACL=file.computeACL||[]

    if (file.public){
        return true
    }

     // owner can DL
    if (file.owner_id===user.id){
        return true
    }

    // superadmin can DL
    if (user.role.indexOf("superadmin")>=0){
        return true
    }

    // readACL user can DL
    if (file.readACL.indexOf(user.id)>=0){
        return true
    }

    // readACL team can DL
    if (user.teams.some((team)=>{
        return file.readACL.indexOf(`#${team}`)>=0
    })){
        return true
    }

    return false

}

export const canDownloadFiles = (files,user)=>{
    if (files.some((f)=>{
        return !canDownloadFile(f,user)
    })){
        return false
    }
    return true
}

