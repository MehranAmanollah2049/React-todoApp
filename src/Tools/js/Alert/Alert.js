import React from 'react'
import './Alert.css'

export default function Alert(type, text, timer = 5000) {

    let icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSvgjs="http://svgjs.com/svgjs" x="0" y="0" viewBox="0 0 24 24"  xmlSpace="preserve" ><g><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0Zm6.2 10.512-4.426 4.345a3.984 3.984 0 0 1-2.8 1.151 3.984 3.984 0 0 1-2.776-1.129l-1.899-1.867a1 1 0 1 1 1.402-1.426l1.893 1.861c.776.75 2.001.746 2.781-.018L16.8 9.085a.999.999 0 1 1 1.4 1.427Z"  opacity="1" data-original="#000000" ></path></g></svg>`,

        error: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlnsSvgjs="http://svgjs.com/svgjs" x="0" y="0" viewBox="0 0 24 24"
             xmlSpace="preserve">
            <g>
                <path
                    d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0Zm3.707 14.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414L10.586 12 8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293Z"
                    data-original="#000000"></path>
            </g>
        </svg>`,

    }


    let Notification = document.querySelector(".Notification");

    let toast = document.createElement('div');
    toast.className = `AlertBox ${type}`
    toast.innerHTML = `${icons[type]}
    <p class='alert-text'>${text}</p>
    <div class='progressBar'></div>`
    Notification.appendChild(toast);

    let thisToast = Notification.lastElementChild;
    thisToast.setAttribute("style", `--height: ${-(thisToast.clientHeight + 15)}px;--timer: ${timer / 1000}s`)
    toast.classList.add("show");

    toast.time = setTimeout(() => {
        removeAlert(toast)
    }, timer);

    function removeAlert(toast) {

        toast.classList.add("hidden")
        setTimeout(() => {
            toast.remove()
        }, 500);
    }

}


