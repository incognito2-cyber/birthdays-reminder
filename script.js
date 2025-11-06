const db = firebase.database();
const messaging = firebase.messaging();
const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("birthdaysList");
const clearAllBtn = document.getElementById("clearAll");
const toastContainer = document.getElementById("toastContainer");

function showToast(message){
  const toast = document.createElement("div");
  toast.textContent=message;
  toast.style.cssText="background:#007bff;color:white;padding:10px 15px;margin-top:10px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.5s";
  toastContainer.appendChild(toast);
  requestAnimationFrame(()=>toast.style.opacity="1");
  setTimeout(()=>{toast.style.opacity="0";toast.addEventListener("transitionend",()=>toast.remove());},4000);
}

function addBirthday(){
  const name=nameInput.value.trim();
  let date=dateInput.value.trim();
  if(!name)return;
  if(!date)date=new Date().toISOString().slice(0,10);
  db.ref("birthdays").push({name,date});
  nameInput.value=""; dateInput.value="";
}
addBtn.addEventListener("click",addBirthday);
[nameInput,dateInput].forEach(i=>i.addEventListener("keypress",e=>{if(e.key==="Enter")addBirthday();}));

function isToday(d){const today=new Date(); const date=new Date(d); return today.getDate()===date.getDate() && today.getMonth()===date.getMonth();}

function renderList(snapshot){
  list.innerHTML="";
  snapshot.forEach(child=>{
    const key=child.key;
    const {name,date}=child.val();
    const li=document.createElement("li");

    const nameSpan=document.createElement("span");
    nameSpan.textContent=name;
    nameSpan.onclick=()=>{ const input=document.createElement("input"); input.type="text"; input.value=nameSpan.textContent; nameSpan.replaceWith(input); input.focus(); input.addEventListener("blur",()=>{const newName=input.value.trim(); if(newName){db.ref("birthdays").child(key).update({name:newName}); nameSpan.textContent=newName;} input.replaceWith(nameSpan);}); input.addEventListener("keypress",e=>{if(e.key==="Enter")input.blur();}); };

    const dateSpan=document.createElement("span");
    dateSpan.textContent=date;
    dateSpan.style.marginLeft="10px";
    dateSpan.onclick=()=>{ const input=document.createElement("input"); input.type="text"; input.value=dateSpan.textContent; dateSpan.replaceWith(input); input.focus(); input.addEventListener("blur",()=>{const newDate=input.value.trim(); if(newDate){db.ref("birthdays").child(key).update({date:newDate}); dateSpan.textContent=newDate;} input.replaceWith(dateSpan);}); input.addEventListener("keypress",e=>{if(e.key==="Enter")input.blur();}); };

    const checkSpan=document.createElement("span");
    checkSpan.style.marginLeft="10px";
    if(isToday(date)){checkSpan.textContent="🎉"; showToast(`🎉 Сегодня день рождения у ${name}!`);}

    const delBtn=document.createElement("button");
    delBtn.textContent="✕";
    delBtn.onclick=()=>{if(confirm(`Удалить ${name}?`))db.ref("birthdays").child(key).remove();};

    li.appendChild(nameSpan); li.appendChild(dateSpan); li.appendChild(checkSpan); li.appendChild(delBtn);
    list.appendChild(li);
  });
}

db.ref("birthdays").on("value",renderList);
clearAllBtn.addEventListener("click",()=>{if(confirm("Удалить весь список?"))db.ref("birthdays").remove();});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("firebase-messaging-sw.js")
    .then(()=>console.log("SW зарегистрирован"))
    .catch(err=>console.error("Ошибка SW:",err));
}

Notification.requestPermission().then(permission=>{
  if(permission==="granted"){
    messaging.usePublicVapidKey("BMhjknZIvmmVFZf3tBlCuLf5VPxxdvrTLnUfFuCt9PPFlk-zy70xVEKIp8_E2zvrUemrH_l5BIU0Hd1I4JsU-HI");
    messaging.getToken().then(token=>{console.log("FCM Token:",token);firebase.database().ref("tokens").child(token).set(true);});
  }
});
