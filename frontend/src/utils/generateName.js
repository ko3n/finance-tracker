const names = [
    "andrew",
    "matthew",
    "andrea",
    "mary"
];

function randomName(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

export function Name(){
    return randomName(names);
}

