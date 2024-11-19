export const validateEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const getInitials = (name)=>{
    if(!name) return "X"
    const words = name.trim().split(" ");
    let initals  = ""
    for(let i = 0 ; i < Math.min(words.length,2);i++){
        initals+=words[i][0]
    }
    return initals.toUpperCase()
}

export const getEmptyCardMessage = (filterType)=>{
    switch (filterType) {
        case "search":
            return `Opps!, No story Availble`
        
        case "date":
            return `Opps!, No story in date Availble`
        
    
        default:
            return `Start Creating Your First Travel Story Here : Lets Get Started by click the <strong>'+'</strong> in corner`;
    }
}