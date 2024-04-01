export function findMaxAndMinDOB(){
    let curr_date = new Date();
    
    // Setting max date to 18 years and min date to 100 years ago from today.
    let max_date = new Date(curr_date.getFullYear() - 18, curr_date.getMonth(), curr_date.getDate());
    let min_date = new Date(curr_date.getFullYear() - 100, curr_date.getMonth(), curr_date.getDate());
    
    //splits the ISO string at the 'T' character, separating the date part from the time part.
    max_date = max_date.toISOString().split('T')[0]; 
    min_date = min_date.toISOString().split('T')[0]; 

    return { max_date, min_date };
}

export function findIndustryCode(industry_name){
    const industries = {
        "": "None", 
        "IT": "Information Technology",
        "MED": "Medicine",
        "ECMM": "Ecommerce",
        "CAR": "Car Dealership",
        "FIN": "Finance",
        "EDU": "Education",
        "MAN": "Manufacturing",
        "TRA": "Transportation",
        "HOS": "Hospitality",
        "ART": "Art and Design",
        "ENT": "Entertainment",
        "AGR": "Agriculture",
        "CON": "Construction",
        "PHA": "Pharmaceuticals",
        "TEL": "Telecommunications",
        "RST": "Restaurant",
        "COS": "Cosmetics",
        "FIT": "Fitness",
        "TRV": "Travel",
        "ADV": "Advertising"
    };


    for (const [code, name] of Object.entries(industries)) {
        if (name === industry_name) {
            return code;
        }
    }

    return "Industry Code not found";
}

export function findIndustryName(code){
    const industries = {
        "": "None", 
        "IT": "Information Technology",
        "MED": "Medicine",
        "ECMM": "Ecommerce",
        "CAR": "Car Dealership",
        "FIN": "Finance",
        "EDU": "Education",
        "MAN": "Manufacturing",
        "TRA": "Transportation",
        "HOS": "Hospitality",
        "ART": "Art and Design",
        "ENT": "Entertainment",
        "AGR": "Agriculture",
        "CON": "Construction",
        "PHA": "Pharmaceuticals",
        "TEL": "Telecommunications",
        "RST": "Restaurant",
        "COS": "Cosmetics",
        "FIT": "Fitness",
        "TRV": "Travel",
        "ADV": "Advertising"
    };

    const industry = industries[code] || "Industry not found";

    return industry;
}