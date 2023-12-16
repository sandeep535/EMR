const EMRAlert = {
    alertifySuccess: (message) => {
        var elem = document.getElementById('mainAlertDiv');
        var iDiv = document.createElement('div');
        iDiv.id = 'customAlertId';
        iDiv.className = 'input-group successAlertCss';
        elem.appendChild(iDiv);
        var spanDiv = document.createElement('span');
        spanDiv.className = 'input-group-addon inSideDiv';
        var iconFont = document.createElement('i');
        iconFont.className = 'fa fa-check fontawsomeCss';
        spanDiv.appendChild(iconFont);
        iDiv.appendChild(spanDiv);
        var textSpan = document.createElement('span');
        textSpan.id = 'textDiv';
        iDiv.appendChild(textSpan);
        iDiv.style = "display:flex";
        textSpan.innerHTML = message;
        hideAlert(iDiv, 5000);
    },
    alertifyError: (message) => {
        var elem = document.getElementById('mainAlertDiv');
        var iDiv = document.createElement('div');
        iDiv.id = 'customAlertId';
        iDiv.className = 'input-group errorAlertCss';
        elem.appendChild(iDiv);
        var spanDiv = document.createElement('span');
        spanDiv.className = 'input-group-addon inSideErrorDiv';
        var iconFont = document.createElement('i');
        iconFont.className = 'fa fa-times fontawsomeCss';
        spanDiv.appendChild(iconFont);
        iDiv.appendChild(spanDiv);
        var textSpan = document.createElement('span');
        textSpan.id = 'textDiv';
        iDiv.appendChild(textSpan);
        iDiv.style = "display:flex";
        textSpan.innerHTML = message;
        hideAlert(iDiv, 5000);
    }
}
function hideAlert(iDiv, timeOut) {
    setTimeout(function () {
        iDiv.style = "display:none";
        document.getElementById('mainAlertDiv').removeChild(iDiv)
    }, timeOut);
}
export default EMRAlert
