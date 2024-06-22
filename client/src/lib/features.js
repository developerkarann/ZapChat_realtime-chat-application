import { formControlClasses } from "@mui/material";
import moment from "moment";

const fileFormate = (url = "") => {
    const fileExtention = url.split('.').pop();

    if (fileExtention === 'mp4' || fileExtention === 'webm' || fileExtention === 'ogg') {
        return 'video'
    }

    if (fileExtention === 'mp3' || fileExtention === 'wav') {
        return 'audio'
    }

    if (fileExtention === 'png' || fileExtention === 'jpg' || fileExtention === 'jpeg' || fileExtention === 'gif') {
        return 'image'
    }

    return 'file'
}

// https://res.cloudinary.com/dnxuag27j/image/upload/v1717204144/40ae3fee-a431-4578-b735-d5e53df26a5b.png
const transformImage = (url = '', width = 100) => {
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`)
    return newUrl
}

const getLast7Days = () => {
    const currentDate = moment();

    const last7Days = [];

    for (let i = 0; i < 7; i++) {
        const dayDate = currentDate.clone().subtract(i, 'days');
        const dayName = dayDate.format('dddd');
        last7Days.unshift(dayName)
    }

    return last7Days
}

const getOrSaveFromLocalStorage = ({ key, value, get }) => {
    if (get) {
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}


export { fileFormate, transformImage, getLast7Days, getOrSaveFromLocalStorage }