(function(){
  /* ── À régler une seule fois ─────────────────────────────────────────
     CONTACT_EMAIL : adresse qui reçoit les messages du formulaire.
     FORM_ENDPOINT : (facultatif) URL d'un service de formulaire (Formspree,
     Web3Forms, Netlify Forms…). S'il est vide, le formulaire ouvre la
     messagerie du visiteur avec le message pré-rempli. */
  var CONTACT_EMAIL = "estelleazoulay@hotmail.com";
  var FORM_ENDPOINT = "";

  var root = document.documentElement;
  var TXT = {
    fr:{req:"Ce champ est requis.",mail:"Adresse e-mail invalide.",sending:"Envoi…",ok:"Merci, votre message a bien été envoyé.",ko:"L’envoi a échoué. Merci de réessayer.",mailto:"Votre messagerie s’ouvre avec le message prêt à être envoyé. Si rien ne s’ouvre, écrivez à ",none:"Le formulaire n’est pas encore relié à une adresse e-mail."},
    en:{req:"This field is required.",mail:"Invalid e-mail address.",sending:"Sending…",ok:"Thank you, your message has been sent.",ko:"Sending failed. Please try again.",mailto:"Your mail app opens with the message ready to send. If nothing opens, write to ",none:"The form is not connected to an e-mail address yet."}
  };
  function lang(){return root.getAttribute("data-lang")==="en"?"en":"fr";}
  function setLang(l,save){
    root.setAttribute("data-lang",l);root.setAttribute("lang",l);
    document.querySelectorAll(".lang button").forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-set")===l));});
    if(save){try{localStorage.setItem("st-lang",l);}catch(e){}}
  }
  var saved=null;try{saved=localStorage.getItem("st-lang");}catch(e){}
  setLang(saved==="en"||saved==="fr"?saved:((navigator.language||"fr").toLowerCase().indexOf("fr")===0?"fr":"en"),false);
  document.querySelectorAll(".lang button").forEach(function(b){b.addEventListener("click",function(){setLang(b.getAttribute("data-set"),true);});});

  var form=document.getElementById("contact-form"),status=document.getElementById("cf-status"),send=document.getElementById("cf-send");
  function say(key,bad){status.textContent=TXT[lang()][key];status.className=bad?"bad":"";}
  function check(el){
    var f=el.parentNode,old=f.querySelector(".err");if(old)f.removeChild(old);
    var v=el.value.trim(),k=!v?"req":(el.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?"mail":"");
    el.setAttribute("aria-invalid",k?"true":"false");
    if(k){var s=document.createElement("span");s.className="err";s.textContent=TXT[lang()][k];f.appendChild(s);}
    return !k;
  }
  form.addEventListener("submit",function(ev){
    ev.preventDefault();status.textContent="";
    var els=[form.elements.name,form.elements.email,form.elements.message],ok=true,first=null;
    els.forEach(function(el){if(!check(el)){ok=false;first=first||el;}});
    if(!ok){first.focus();return;}
    if(form.elements.website.value){return;}
    var d={name:els[0].value.trim(),email:els[1].value.trim(),message:els[2].value.trim()};
    if(FORM_ENDPOINT){
      send.disabled=true;say("sending");
      fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(d)})
        .then(function(r){if(!r.ok)throw new Error(r.status);form.reset();say("ok");})
        .catch(function(){say("ko",true);})
        .then(function(){send.disabled=false;});
    }else if(CONTACT_EMAIL){
      location.href="mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent("Story Telling — "+d.name)+"&body="+encodeURIComponent(d.message+"\n\n"+d.name+"\n"+d.email);
      say("mailto");status.textContent+=CONTACT_EMAIL;
    }else{say("none",true);}
  });
})();
