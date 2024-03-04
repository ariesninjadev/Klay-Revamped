// 3 sends: login, recieve, critera flipflop

var emoji = new EmojiConvertor();

function appendHtml(el, str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}

timeelem = document.getElementById("timeblock");
var etx = new Date();
timeelem.innerHTML = `<span class="panel-icon iconuni">
              <i class="fa-solid fa-clock"></i>
            </span> ${fTime(etx)} `;
setInterval(function () {
  etx = new Date();
  timeelem.innerHTML = `<span class="panel-icon iconuni">
              <i class="fa-solid fa-clock"></i>
            </span> ${fTime(etx)} `;
}, 2000);

var userfocused = true;
var userbottom = true;

var typerscrollenforce = true;

window.onblur = function () {
  userfocused = true;
};
window.onfocus = function () {
  userfocused = false;
};

try {
  $(document).ready(function () {
    $("div").on("scroll", chk_scroll);
  });

  function chk_scroll(e) {
    var elem = $(e.currentTarget);
    if (elem[0].scrollHeight - elem.scrollTop() <= elem.outerHeight() + 44) {
      userbottom = true;
    } else {
      userbottom = false;
    }
  }
} catch (err) {
  alertify.error(err);
}

var user;

var socket = io();

function fTime(now) {
  var hours = now.getHours();
  var minutes = now.getMinutes();
  if (hours > 12) {
    hours = hours - 12;
    var setX = "pm";
  } else if (hours == 12) {
    var setX = "pm";
  } else if (hours == 0) {
    hours = 12;
    var setX = "am";
  } else {
    var setX = "am";
  }
  if (minutes <= 9) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes} ${setX}`;
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const $targetEl = document.getElementById("tos");

const $targetEl2 = document.getElementById("addFriendPopup");

const $targetEl3 = document.getElementById("addChatPopup");

const $targetEl4 = document.getElementById("editChatPopup");

const optionsEl = {
  closable: false,
  backdropClasses:
    "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
};

//import { Modal } from 'flowbite';

/*
 * $targetEl: required
 * options: optional
 */
const modal = new Modal($targetEl, optionsEl);

const modal2 = new Modal($targetEl2);

const modal3 = new Modal($targetEl3);

const modal4 = new Modal($targetEl4);

if (getCookie("terms") != "true") {
  modal.show();
}

function tosAccept() {
  setCookie("terms", "true", 3650);
  modal.hide();
}

function showfpmodel() {
  modal2.show();
}

function hidefpmodel() {
  modal2.hide();
}

function showcpmodel() {
  modal3.show();
}

function hidecpmodel() {
  modal3.hide();
}

function chatOptions() {
  modal4.show();
}

function tosDecline() {
  setCookie("terms", "false", 3650);
  eraseCookie("acc");
  window.location.href = "/login";
}

function off() {
  var vdsi;
  for (const chat of resuser.data.chats) {
    if (chat.id === chatId) {
      vdsi = chat.viewdata.startIndex;
    }
  }
  socket.emit("login", vdsi);
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "/css/main.css";

  // Append the link element to the head of the document
  document.head.appendChild(link);

  // Define a function to be executed after the CSS file is loaded
  function myFunctionT() {
    overlayn = document.getElementById("overlayn");
    if (overlayn) {
      overlayn.remove();
    }
    if (getCookie("terms") != "true") {
      modal.show();
    }
  }

  // Add an event listener to the link element to detect when it's loaded
  link.onload = myFunctionT;
}

var d;
socket.emit("verifyId", getCookie("acc"));

socket.on("verifyIdResult", (resuser) => {
  if (!resuser) {
    eraseCookie("acc");
    window.location.href = "/login";
  } else if (resuser.account.username == "@UNSET") {
    window.location.href = "/onboarding";
  } else {
    user = resuser;
    socket.emit("homelogin", user.account.gsub); // include isp framing -- buffer tick space
  }
});

var permData;

var resuser;

var otherNAME;
var otherEMAIL;

socket.on("userdata", (resuse) => {

  resuser = resuse;
  var mcl = resuser.data.chats.length;
  if (resuser.account.status == 0) {
    if (resuser.account.metadata.bandata.bantext != "") {
      document.getElementById("overlayn").innerHTML =
        '<br><br><br><h1 style="text-align:center;font-size:2em;">Klay</h1><br><p style="text-align:center;">' +
        resuser.account.metadata.bandata.bantext +
        '</p><br><p style="text-align:center;font-size:0.7em;color:#999;">YOU MAY NOT CREATE A NEW ACCOUNT.<br><br>IF CAUGHT ATTEMPTING TO MAKE A NEW ACCOUNT,<br> ANY TEMPORARY BAN WILL BE MADE PERMANENT.</p>';
    } else {
      document.getElementById("overlayn").innerHTML =
        '<br><br><br><h1 style="text-align:center;font-size:2em;">Klay</h1><br><p style="text-align:center;">You no longer has access to Klay. No reason was provided.</p><br><p style="text-align:center;font-size:0.7em;color:#999;">YOU MAY NOT CREATE A NEW ACCOUNT.<br><br>IF CAUGHT ATTEMPTING TO MAKE A NEW ACCOUNT,<br> ANY TEMPORARY BAN WILL BE MADE PERMANENT.</p>';
    }
  } else {
    socket.on("getCMLName", (name, xc) => {
      if (name == false) {
        document.getElementById(
          "chatsnav"
        ).innerHTML += `<a href="/chat/${xc.id}" class="panel-block" style="border-radius: 0px 0px 0px 0px !important;">Deleted User</a>`;
      } else {
        document.getElementById(
          "chatsnav"
        ).innerHTML += `<a href="/chat/${xc.id}" class="panel-block" style="border-radius: 0px 0px 0px 0px !important;">${name}</a>`;
      }
      mcl -= 1;
      if (mcl == 0) {
        off();
      }
    });

    socket.on("getCMName", (name, uid, email) => {
      otherNAME = name;
      otherEMAIL = email;
      if (name == false) {
        name = "Deleted User";
      }
      document.getElementById("chat-name").innerText = name;
      tcnav.innerHTML += `<a class="panel-block " style="border-radius: 0px 0px 6px 6px !important;">
          <span class="panel-icon">
            <i  id='uoi-${uid}' class="fa-regular fa-circle iconuni"></i>
          </span>
          ${name}
        </a>`;
      document.getElementById("chat-input").placeholder = "Message " + name;
      if (resuser.data.chats.length == 0) {
        off();
      }
      for (const i of resuser.data.chats) {
        if (i.type == "d") {
          if (i.members[0] == resuser.account.id) {
            refid = i.members[1];
            socket.emit("getCMLName", i.members[1], i);
          } else if (i.members[1] == resuser.account.id) {
            refid = i.members[0];
            socket.emit("getCMLName", i.members[0], i);
          } else {
            alert("There was an error. Try reloading the page.");
          }
        }
      }
    });

    socket.on("chatResponse", (chatData) => {
      permData = chatData;
      if (chatData) {
        if (chatData.type == "d") {
          if (chatData.members[0] == resuser.account.id) {
            socket.emit("getCMName", chatData.members[1]);
          } else if (chatData.members[1] == resuser.account.id) {
            socket.emit("getCMName", chatData.members[0]);
          } else {
            alert("There was an error. Try reloading the page.");
          }
        }
      } else {
        console.log(chatData);
        window.location.replace("/home");
      }
    });

    socket.emit("chatCheck", resuser.account.id, chatId);
  }
  
});

(function () {
  $(".inputboxjs2").on("keyup change", function () {
    var empty = false;

    $(".inputboxjs2").each(function () {
      if ($(this).val().length <= 2) {
        empty = true;
      }
      if ($(this).val().length >= 17) {
        empty = true;
      }
    });

    if (empty) {
      document.getElementById("caddsubmitbtn").disabled = true;
    } else {
      document.getElementById("caddsubmitbtn").disabled = false;
    }
  });
})();

/*socket.on("credentialdata", function(ud) {


     if (getCookie("secKey") == d.user1.cookie) {
    user = d.user1.name

    socket.emit('login',{userId:user});
    off();
  } else if (getCookie("secKey") == "8605D") {
    user = d.user2.name
    socket.emit('login',{userId:user});
    off();
  } else {
    window.location.replace("/login");
  }



/*if (user == "Aries") {
    document.getElementById("chat-input").setAttribute("placeholder","Message {OTHER_USER}")
  } else {
    document.getElementById("chat-input").setAttribute("placeholder","Message Aries")
  }


  });*/

socket.on("userToIdResult", function (exid) {
  if (resuser.data.chats.some((e) => e.members.includes(exid))) {
    alertify.error("You already have a chat with this user!");
    return false;
  }

  if (exid == resuser.account.id) {
    alertify.error("What the hell, thats you.");
  } else {
    if (!exid) {
    } else {
      socket.emit("checkAndSendC", exid, resuser.account.id);
    }
  }
});

function caddsubmit() {
  try {
    let er = document.getElementById("caddusername").value.trim();

    socket.emit("userToId", er);
  } catch (e) {
    alert("There was an error: " + e);
  }
}

function logout() {
  eraseCookie("acc");
  window.location.replace("/login");
}

var popupTimeout;

function changecheck() {
  var input = document.getElementById("chat-input").value;

  if (input == "") {
    document.getElementById("subm").disabled = true;
  } else {
    emoji.replace_mode = "unified";
    emoji.allow_native = true;
    document.getElementById("chat-input").value = emoji.replace_colons(input);
    document.getElementById("subm").disabled = false;
  }

  // Check if the first character is "/"
  if (input.startsWith("/")) {
    // Show non-blocking popup if not already shown
    if (!document.querySelector(".popup")) {
      showPopup("/ping - Alert chat members");
    }
  } else {
    // Hide popup if condition is no longer met
    hidePopup();
  }

  socket.emit("typingPing", user);
}

function showPopup(message) {
  document.getElementById("cmdbox").classList.remove("bcont");
}

function hidePopup() {
  document.getElementById("cmdbox").classList.add("bcont");
}

function triggercmd(cmd) {
  document.getElementById("chat-input").value = "/" + cmd;
}

document
  .getElementById("chat-input")
  .addEventListener("input", (event) => changecheck());

document.addEventListener("DOMContentLoaded", function () {
  const $ = (selector) => Array.from(document.querySelectorAll(selector));

  function h(tagName, attributes, children) {
    const element = document.createElement(tagName);

    // Set attributes
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });

    // Append/set children
    if ("string" === typeof children) {
      element.innerHTML = children;
    } else if (Array.isArray(children)) {
      children.forEach((child) => !!child && element.appendChild(child));
    } else if (!!children) {
      element.appendChild(children);
    }

    return element;
  }

  function scrollDownChatV() {
    console.log("downed")
    const container = $("#chat-messages-container")[0];

    container.scrollTop = container.scrollHeight;
  }

  function scrollDownChat() {
    const container = $("#chat-messages-container")[0];
    const scrollHeight = container.scrollHeight;
    const currentScrollTop = container.scrollTop;
    const targetScrollTop = scrollHeight - container.clientHeight;
    const duration = 500; // Adjust the duration of the animation (in milliseconds)

    const startTime = Date.now();

    function scrollAnimation() {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const scrollProgress = Math.min(1, elapsedTime / duration);
      const easing = easeOutQuad(scrollProgress);
      container.scrollTop =
        currentScrollTop + easing * (targetScrollTop - currentScrollTop);

      if (scrollProgress < 1) {
        requestAnimationFrame(scrollAnimation);
      }
    }

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    requestAnimationFrame(scrollAnimation);
  }

  var targetmsg = "";
  var replymode = false;

  var messageTimeCache = [];

  function createChatBubble(
    textraw,
    wasReceived,
    timeval,
    msgId = false,
    ping = false,
    r = false,
    rc = "",
    im = false,
    imc = ""
  ) {
    var timexv = new Date(timeval);

    try {
      xra = new Date(timeval);
      timet = fTime(xra);
    } catch (e) {
      timet = e;
    }

    const messageDay = timexv.toDateString();

    // Check if the day is not present in messageTimeCache
    if (!messageTimeCache.includes(messageDay)) {
      // Call createTimeBlock function
      messages.appendChild(createTimeBlock(timexv));

      // Add the day to messageTimeCache to avoid calling createTimeBlock again for the same day
      messageTimeCache.push(messageDay);
    }

    var text = textraw.replace(
      /(<a href=")?((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)))(">(.*)<\/a>)?/gi,
      function () {
        return (
          '<a href="' +
          arguments[2] +
          '">' +
          (arguments[7] || arguments[2]) +
          "</a>"
        );
      }
    );

    const replyButton = h(
      "button",
      {
        class: "reply-btn",
      },
      '<i class="fa-solid fa-reply"></i>'
    );
    if (rc == "") {
      secT = "Replying to image";
    } else {
      secT = '"' + rc + '" ';
    }
    var wrapper = h(
      "div",
      {
        class: "chat-message-wrapper",
      },
      [
        // 1. Element
        wasReceived
          ? null
          : h("div", {
              class: "chat-message-push",
            }),

        // 2. Element
        h(
          "div",
          {
            class:
              "chat-message p-3 " +
              (ping
                ? wasReceived
                  ? "ping-r"
                  : "ping-s"
                : wasReceived
                ? "received"
                : "sent"),
            msgId: msgId ? msgId : 0,
          },
          [
            h(
              "div",
              {
                class: "has-text-right is-size-7",
              },
              [replyButton, h("time", {}, "   " + timet + " ")]
            ),
            r
              ? h(
                  "div",
                  {
                    class: "chat-message-content",
                    style: "font-size:0.7em;color:#444444;font-style:italic;",
                  },
                  secT
                )
              : null,

            h(
              "div",
              {
                class: "chat-message-content",
              },
              im
                ? h(
                    "img",
                    {
                      src: imc,
                      alt: "User Photo",
                      width: "500",
                      style: "margin-top:5px;",
                    },
                    ""
                  )
                : text
            ),
          ]
        ),
      ]
    );

    replyButton.addEventListener("click", function () {
      document.getElementById("chat-input").focus();
      var vstxx = wrapper.textContent.split(" "); //NOTE: THIS IS NOT A SPACE. IT IS A HAIRSPACE.
      var contxx = vstxx[vstxx.length - 1];
      targetmsg = contxx;
      document.getElementById("replycontent").innerHTML =
        '<button id="crp" style="cursor:pointer;margin-right:10px;background:none;border:0;"><i class="fa-solid fa-xmark"></i></button>Replying to: ' +
        contxx;
      document.getElementById("crp").addEventListener("click", function () {
        cancelreply();
      });
      replymode = true;
    });

    return wrapper;
  }

  function createTyper() {
    const wrapper = h(
      "div",
      {
        class: "chat-message-wrapper",
        id: "typingindicatorp",
      },
      [
        // 2. Element
        h(
          "div",
          {
            class: "chat-message p-3 received",
          },
          [
            h(
              "div",
              {
                class: "has-text-right",
                style: "font-size:.7rem!important",
              },
              " " //  HAIRSPACE
            ),
            h(
              "div",
              {
                class: "chat-message-content",
                style: "width:20px;margin:0 auto;",
              },
              '<div class="ticontainer"><div style="align-items:start!important" class="tiblock"><div class="tidot"></div><div class="tidot"></div><div class="tidot"></div></div></div>'
            ),
          ]
        ),
      ]
    );

    return wrapper;
  }

  function createTimeBlock(messageDate) {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const formatTimestamp = (date) => {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      if (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() === currentDate.getDate()
      ) {
        return `Today ${formatTime(date)}`;
      } else if (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
      ) {
        return `Yesterday ${formatTime(date)}`;
      } else {
        return `${daysOfWeek[date.getDay()]} ${date.toLocaleString("en-US", {
          month: "short",
        })} ${date.getDate()}, ${formatTime(date)}`;
      }
    };

    const wrapper = h("div", { class: "time-block" }, [
      h("p", {}, formatTimestamp(messageDate)),
    ]);

    return wrapper;
  }

  socket.on("checkExistsC", (resolve, amble) => {
    if (resolve) {
      alertify.success("Chat created!");
      setTimeout(function () {
        window.location.href = "/chat/" + amble;
      }, 1500);
    } else {
      alertify.error(amble);
    }
  });

  socket.on("pingVerify", (status, time) => {
    if (status) {
      thisMsgId =
        Date.now().toString() + Math.floor(100000 + Math.random() * 900000);
      alertify.success("User Pinged!");
      messages.appendChild(
        createChatBubble("Sent a ping!", false, new Date(), thisMsgId, true)
      );
      socket.emit("chatOutbound", {
        trs: "Sent a ping!",
        id: thisMsgId,
        usert: user.account.id,
        timev: new Date(),
        r: false,
        rc: "",
        tpan: false,
        tp_avatar: "",
        ping: true,
      });
    } else {
      alertify.error(
        "You must wait " + time + " seconds before pinging this user again."
      );
    }
  });

  //document.getElementById("replycontent").addEventListener("click", cancelreply())

  const messages = $("#chat-messages-container")[0];

  // ---- MESSAGE SUBMIT ---- //

  const form = $("#form-wrap")[0];

  const MESSAGE_LIMIT = 10;
  const TIME_LIMIT_SECONDS = 10;

  form.addEventListener("submit", function (event) {
    event.stopPropagation();
    event.preventDefault();
    document.getElementById("cmdbox").classList.add("bcont");
    if (document.getElementById("chat-input").value == "") {
      return false;
    }

    if (typeof Storage !== "undefined") {
      // Get the current timestamp
      const currentTime = Math.floor(Date.now() / 1000);

      // Retrieve message count and timestamp from localStorage
      let messageCount = parseInt(localStorage.getItem("messageCount")) || 0;
      let lastMessageTime =
        parseInt(localStorage.getItem("lastMessageTime")) || 0;

      // Check if the time limit has passed since the last message
      if (currentTime - lastMessageTime < TIME_LIMIT_SECONDS) {
        // Check if the message limit has been exceeded
        if (messageCount >= MESSAGE_LIMIT) {
          alertify.error("Woah, slow down!");
          return false;
        }
      } else {
        // Reset the message count if the time limit has passed
        messageCount = 0;
      }

      // Increment the message count and update the timestamp
      messageCount++;
      localStorage.setItem("messageCount", messageCount);
      localStorage.setItem("lastMessageTime", currentTime);
    }

    if (document.getElementById("chat-input").value.length > 1000) {
      alertify.error("Messages must contain fewer than 1000 letters!");
      return false;
    }
    document.getElementById("replycontent").innerText = "";

    if (document.getElementById("chat-input").value == "/clear") {
      socket.emit("clearclear", chatId);
      location.reload();
      return false;
    }

    if (document.getElementById("chat-input").value == "/ping") {
      $("#chat-input")[0].value = "";
      socket.emit(
        "ping",
        otherEMAIL,
        chatId,
        otherNAME,
        user.account.username,
        user.account.id
      );
      return false;
    }

    if (
      document.getElementById("chat-input").value == "/clearallchats" &&
      resuser.account.metadata.admin
    ) {
      socket.emit("destroyAllChats");

      location.reload();
      return false;
    }

    if (document.getElementById("chat-input").value == "/force") {
      socket.emit("forceforce");
      return false;
    }

    const input = $("#chat-input")[0];
    trs = input.value;
    timev = new Date();
    document.getElementById("subm").disabled = true;
    r = replymode;
    rc = targetmsg;
    typerscrollenforce = true;
    tpan = false;
    tp_avatar = "";
    usert = user.account.id;
    msgId = Date.now().toString() + Math.floor(100000 + Math.random() * 900000);
    socket.emit("chatOutbound", {
      trs,
      id: msgId,
      usert,
      timev,
      r,
      rc,
      tpan,
      tp_avatar,
      ping: false,
    });

    if (replymode) {
      messages.appendChild(
        createChatBubble(
          input.value,
          false,
          timev,
          msgId,
          false,
          true,
          targetmsg
        )
      );
      replymode = false;
      targetmsg = "";
      r = false;
      rc = "";
    } else {
      messages.appendChild(
        createChatBubble(input.value, false, timev, msgId, false)
      );
    }

    input.value = "";

    if (tactive == true) {
      document.getElementById("typingindicatorp").remove();
      document
        .getElementById("chat-messages-container")
        .appendChild(createTyper());
    }

    setTimeout(scrollDownChat, 250);
    document.getElementById("chat-input").focus();
  });

  socket.on("chatIncoming", function (msg) {
    if (msg.usert == user.account.id) {
      // messages.appendChild(
      //   createChatBubble(msg.trs, false, msg.timev, msg.id, msg.ping, msg.r, msg.rc, msg.tpan, msg.tp_avatar)
      // );
    } else {
      if (tactive == true) {
        clearTimeout(typingTimeout);
        tactive = false;
        tactivelocal = false;
        document.getElementById("typingindicatorp").remove();
      } else {
        //alert("if u see this, tell aries 'err-03'")
      }
      try {
        messages.appendChild(
          createChatBubble(
            msg.trs,
            true,
            msg.timev,
            msg.id,
            msg.ping,
            msg.r,
            msg.rc,
            msg.tpan,
            msg.tp_avatar
          )
        );

        if (userbottom == true) {
          scrollDownChat();
        }
      } catch (e) {
        alert("There may have been an error. Please reload the page.");
        console.log(e);
      }
      //notify(msg.user,msg.trs)
    }
  });
  /*
  socket.on('update', function(online) {
    socket.emit("reping",{userId:user})
    if (online.aries) {
      document.getElementById("user-1-o").setAttribute("class","fa-solid fa-circle")
      document.getElementById("user-1-o").setAttribute("style","color: #ff91e9;")
    } else {
      document.getElementById("user-1-o").setAttribute("class","fa-regular fa-circle")
      document.getElementById("user-1-o").setAttribute("style","color: #c4c4c4;")
    }
    if (online.liz) {
      document.getElementById("user-2-o").setAttribute("class","fa-solid fa-circle")
      document.getElementById("user-2-o").setAttribute("style","color: #ff91e9;")
    } else {
      document.getElementById("user-2-o").setAttribute("class","fa-regular fa-circle")
      document.getElementById("user-2-o").setAttribute("style","color: #c4c4c4;")
    }
  });

  socket.on('reupdate', function(online) {
    if (online.aries) {
      document.getElementById("user-1-o").setAttribute("class","fa-solid fa-circle")
      document.getElementById("user-1-o").setAttribute("style","color: #ff91e9;")
    } else {
      document.getElementById("user-1-o").setAttribute("class","fa-regular fa-circle")
      document.getElementById("user-1-o").setAttribute("style","color: #c4c4c4;")
    }
    if (online.liz) {
      document.getElementById("user-2-o").setAttribute("class","fa-solid fa-circle")
      document.getElementById("user-2-o").setAttribute("style","color: #ff91e9;")
    } else {
      document.getElementById("user-2-o").setAttribute("class","fa-regular fa-circle")
      document.getElementById("user-2-o").setAttribute("style","color: #c4c4c4;")
    }
  });
*/
  socket.on("forceclose", function () {
    alert("reload reason: FORCECLOSE");
    location.reload();
  });

  socket.on("forceclosetargeted", function (t) {
    if (t == chatId) {
      alert("reload reason: FORCECLOSETARGETED");
      location.reload();
    }
  });

  socket.on("chatData", function (datamm, myaccount) {
    if (datamm != null) {
      for (const element of datamm) {
        messages.appendChild(
          createChatBubble(
            element.content,
            element.name != user.account.id,
            element.time,
            element.id,
            element.ping,
            element.r,
            element.rc,
            element.im,
            element.imc
          )
        );
      }
    }
    setTimeout(scrollDownChatV(), 100);
  });

  document.getElementById("form-wrap").onkeydown = function (e) {
    if (e.keyCode == 13) {
      document.getElementById("form-wrap").requestSubmit();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  function cancelreply() {
    replymode = false;
    targetmsg = "";
    document.getElementById("replycontent").innerText = "";
  }

  const avatarUploadBtn = document.getElementById("imgupload");
  avatarUploadBtn.addEventListener("click", () => {
    const fileInput = document.createElement("input"); // Create a new file input element
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Set the accepted file types
    // Listen for file selection event
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0]; // Get the selected file
      const reader = new FileReader(); // Create a new FileReader
      reader.onload = (e) => {
        //alertify.success("Save your changes to apply.")
        const fileData = e.target.result; // Get the file data

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // create a new Image object and set its src to the data URL
        const img = new Image();
        img.src = fileData;
        // when the image is loaded, resize it with the specified quality
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var data = imgData.data;
          for (var i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 255) {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
              data[i + 3] = 255;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          // create a new data URL with the reduced quality
          const dataURL = canvas.toDataURL("image/jpeg", 0.2);
          tp_avatar = dataURL;

          document.getElementById("replycontent").innerText = "";
          document.getElementById("subm").disabled = true;
          r = replymode;
          rc = targetmsg;
          trs = "";
          timev = new Date();
          tpan = true;
          usert = user.account.id;
          msgId =
            Date.now().toString() + Math.floor(100000 + Math.random() * 900000);
          socket.emit("chatOutbound", {
            trs,
            id: msgId,
            usert,
            timev,
            r,
            rc,
            tpan,
            tp_avatar,
            ping: false,
          });

          if (replymode) {
            document
              .getElementById("chat-messages-container")
              .appendChild(
                createChatBubble(
                  "",
                  false,
                  timev,
                  msgId,
                  false,
                  true,
                  targetmsg,
                  true,
                  tp_avatar
                )
              );
            replymode = false;
            targetmsg = "";
            r = false;
            rc = "";
          } else {
            document
              .getElementById("chat-messages-container")
              .appendChild(
                createChatBubble(
                  "",
                  false,
                  timev,
                  msgId,
                  false,
                  false,
                  "",
                  true,
                  tp_avatar
                )
              );
          }
          if (userbottom == true) {
            setTimeout(scrollDownChat, 500);
          }
        };
      };
      // Read the file contents
      reader.readAsDataURL(file);
    });
    // Click the file input element to open the file selection dialog
    fileInput.click();
  });

  document.body.addEventListener("paste", (event) => {
    const activeElement = document.activeElement;

    // Check if the active element is a text input or textarea
    if (
      (activeElement.tagName === "INPUT" && activeElement.type === "text") ||
      activeElement.tagName === "TEXTAREA"
    ) {
      const items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
      for (const item of items) {
        if (item.kind === "file" && item.type.includes("image")) {
          const file = item.getAsFile();
          if (confirm("Are you sure you want to paste an image?")) {
            handleImageFile(file);
          }
          event.preventDefault(); // Prevent the default paste behavior
        }
      }
    }
  });

  // Function to handle image file processing
  const handleImageFile = (file) => {
    const reader = new FileReader(); // Create a new FileReader
    reader.onload = (e) => {
      const fileData = e.target.result; // Get the file data
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // create a new Image object and set its src to the data URL
      const img = new Image();
      img.src = fileData;
      // when the image is loaded, resize it with the specified quality
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 255) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        // create a new data URL with the reduced quality
        const dataURL = canvas.toDataURL("image/jpeg", 0.2);
        tp_avatar = dataURL;

        document.getElementById("replycontent").innerText = "";
        document.getElementById("subm").disabled = true;
        r = replymode;
        rc = targetmsg;
        trs = "";
        timev = new Date();
        tpan = true;
        usert = user.account.id;
        msgId =
          Date.now().toString() + Math.floor(100000 + Math.random() * 900000);
        socket.emit("chatOutbound", {
          trs,
          id: msgId,
          usert,
          timev,
          r,
          rc,
          tpan,
          tp_avatar,
          ping: false,
        });

        if (replymode) {
          document
            .getElementById("chat-messages-container")
            .appendChild(
              createChatBubble(
                "",
                false,
                timev,
                msgId,
                false,
                true,
                targetmsg,
                true,
                tp_avatar
              )
            );
          replymode = false;
          targetmsg = "";
          r = false;
          rc = "";
        } else {
          document
            .getElementById("chat-messages-container")
            .appendChild(
              createChatBubble(
                "",
                false,
                timev,
                msgId,
                false,
                false,
                "",
                true,
                tp_avatar
              )
            );
        }
        if (userbottom == true) {
          setTimeout(scrollDownChat, 500);
        }
      };
    };
    // Read the file contents
    reader.readAsDataURL(file);
  };

  var pingres = 0;
  var tactive = false;
  var tactivelocal = false;

  let typingTimeout;

  socket.on("typingPingBC", function (obuser) {
    if (user !== obuser) {
      //setTimeout(scrollDownChat, 250);
      if (!tactivelocal) {
        tactivelocal = true;
        if (tactive == false) {
          document
            .getElementById("chat-messages-container")
            .appendChild(createTyper());
          tactive = true;
        }
        if (typerscrollenforce == true) {
          typerscrollenforce = false;
          if (userbottom == true) {
            scrollDownChat();
          }
        }

        clearTimeout(typingTimeout);
        try {
          clearTimeout(typingTimeoutI);
        } catch (e) {}
        typingTimeout = setTimeout(function () {
          tactivelocal = false;
          typingTimeoutI = setTimeout(function () {
            tactive = false;
            document.getElementById("typingindicatorp").remove();
          }, 2000);
        }, 3000);
      }
    }
  });

  /*var taske = false

    $(window).focus(function() {
      taske = false
  });

  $(window).blur(function() {
      taske = true
  });*/

  /*
   if (!Notification) {
    alert('Notifications not available in your browser.');
    return;
   }

   if (Notification.permission !== 'granted')
    Notification.requestPermission();


  function notify(n,c) {

   if (Notification.permission !== 'grantede') {
    //Notification.requestPermission();
   }  else {
    var notification = new Notification('Message from '+n, {
     icon: 'https://static.thenounproject.com/png/1633777-200.png',
     body: c,
    });
    notification.onclick = function() {
     window.open('https://klay.ariesninja.repl.co');
    };
   }

  }
  */

  var i = 0;
  var pageStatus = true;

  function changeStatus(status) {
    i += 1;
    if (status == true) {
      alert(i + " Page is active");
      pageStatus = true;
      /* change the users status to active */
    } else {
      pageStatus = false;
      window.setTimeout(function () {
        if (pageStatus == false) {
          alert(
            i + " Page is inactive"
          ); /* change the users status to inactive */
        }
      }, 1000);
    }
  }
});

function deleteChatAdmin() {
  socket.emit("deleteChatObject", chatId, resuser.account.metadata.admin);
  window.location.href = "/home";
}

function deleteChatLocal() {
  socket.emit(
    "shiftStartPointer",
    chatId,
    resuser.account.id,
    document.querySelectorAll(".chat-message-wrapper").length
  );
  alert("reload reason: DELETECHATLOCAL");
  window.location.reload();
}

const chatInput = document.getElementById("chat-input");

document.addEventListener("keydown", function (event) {
  // Check if any key is pressed
  if (event.key.length === 1) {
    // Focus on the chat input
    chatInput.focus();
  }
});
