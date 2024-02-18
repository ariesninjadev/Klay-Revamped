// hey future-aries, heres a free SBUS hint:
// 3 sends: login, recieve, critera flipflop

try {
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
    alert(err);
  }

  var user;

  var socket = io();

  socket.on("pleaseTerminate", () => {
    location.reload();
  });

  function asyncEmit(eventName, data) {
    return new Promise(function (resolve, reject) {
      socket.emit(eventName, data);
      socket.on(eventName, (result) => {
        socket.off(eventName);
        resolve(result);
      });
      setTimeout(reject, 1000);
    });
  }

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
    //WITHHELD
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
    //WITHHELD
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  function setCookie(name, value, days) {
    //WITHHELD
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

  function tosDecline() {
    setCookie("terms", "false", 3650);
    eraseCookie("acc");
    window.location.href = "/login";
  }

  function off() {
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
    if (user == "Aries") {
      alert("Logins are not enabled yet.");
      eraseCookie("acc");
      window.location.href = "/login";
    }
    if (!resuser) {
      eraseCookie("acc");
      window.location.href = "/login";
    } else if (resuser.account.username == "@UNSET") {
      window.location.href = "/onboarding";
    } else {
      user = resuser;
      socket.emit("homelogin", user.account.gsub);
    }
  });

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
    off();
  });

  var resuser;

  function frYes(from) {
    socket.emit("frResp", from, true, resuser.account.id);
  }

  function frNo(from) {
    socket.emit("frResp", from, false, resuser.account.id);
  }

  socket.on("userdata", (resuse) => {
    resuser = resuse;
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
      var toml;
      var refid;

      socket.on("getName", (uid, uname, t) => {
        if (!uname) {
          uname = "Deleted User";
        }

        if (t == "f") {
          friendsnav.innerHTML += `<a id='elem-${uid}' class="panel-block" style="border-radius: 0px 0px 6px 6px !important;cursor: default;">
  <span style="cursor: pointer;" class="panel-icon">
    <i id='uoi-${uid}' class="fa-solid fa-circle iconuni"></i>
  </span>
  ${uname}
  <button style="display:flex;justify-content: space-between;margin-left:auto;" onclick="removeFriend('${uid}');"><span class="panel-icon">
    <i class="fa-solid fa-times iconuni"></i>
  </span></button>
</a>
`;
        } else if (t == "pi") {
          friendsnav.innerHTML += `<a class="panel-block visualb" style="border-radius: 0px 0px 6px 6px !important; position: relative;cursor:default!important;">
    <span class="panel-icon">
        <i class="fa-solid fa-arrow-right-to-bracket iconuni"></i>
    </span>
    ${uname}
    <button onclick="frYes('${uid}')" class="square-button" style="background-color: green; color: white; position: absolute; right: 40px;padding: 0px 4px;border-radius:6px;">
        <i class="fa-solid fa-check"></i>
    </button>
    <button onclick="frNo('${uid}')" class="square-button" style="background-color: red; color: white; position: absolute; right: 10px;padding: 0px 5px;border-radius:6px;">
        <i class="fa-solid fa-times"></i>
    </button>
</a>`;
        } else if (t == "po") {
          friendsnav.innerHTML += `<a class="panel-block " style="border-radius: 0px 0px 6px 6px !important;">
          <span title="You sent this request." class="panel-icon">
            <i class="fa-regular fa-hourglass iconuni"></i>
          </span>
          ${uname}
        </a>`;
        }

        toml -= 1;

        if (toml == 0) {
          //         friendsnav.innerHTML += `<a class="panel-block " style="border-radius: 0px 0px 6px 6px !important;">
          //   <span class="panel-icon">
          //     <i class="fa-regular fa-exclamation" style="color: #DD2222;"></i>
          //   </span>
          //   <technic style="font-size:0.6em;">To remove a friend, <br>contact Aries.</technic>
          // </a>`

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
        }
      });

      friendsnav = document.getElementById("friendsnav");
      toml = resuser.data.friends.length + resuser.data.pending.length;
      if (toml == 0) {
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
      }
      arr1 = resuser.data.friends;
      arr2 = resuser.data.pending;
      farr = arr2.concat(arr1);
      for (const i of farr) {
        // - - - - - -- - - - DIFFERENTIATE BETWEEN FRIENDS AND PENDING ------------------------
        // THEN HANDLE DIFFERENCE WITHIN :/srv/server.js:207-216
        if (i.receiver != null) {
          socket.emit("getName", i.user, i.receiver, true);
        } else {
          socket.emit("getName", i.id, false, false);
        }
      }
    }
  });

  socket.on("updateRequests", (spontdata) => {
    if (spontdata == resuser.account.username) {
      location.reload();
    }
  });

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

  (function () {
    $(".inputboxjs").on("keyup change", function () {
      var empty = false;

      $(".inputboxjs").each(function () {
        if ($(this).val().length <= 2) {
          empty = true;
        }
        if ($(this).val().length >= 17) {
          empty = true;
        }
      });

      if (empty) {
        document.getElementById("faddsubmitbtn").disabled = true;
      } else {
        document.getElementById("faddsubmitbtn").disabled = false;
      }
    });
  })();

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

  // -- too lazy to minify this. have fun.

  socket.on("checkExistsF", (resolve, amble) => {
    if (resolve) {
      alertify.success("Request sent!");
      location.reload();
    } else {
      alertify.error(amble);
    }
  });

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

  socket.on("userToIdFResult", function (exid) {
    if (resuser.data.pending.some((e) => e.user == exid)) {
      alertify.error(
        "You have already sent a request to this user or they have already sent one to you!"
      );
      return false;
    }

    if (exid == resuser.account.id) {
      alertify.error("What the hell, thats you.");
    } else {
      if (!exid) {
        alertify.error("User doesn't exist!");
      } else {
        socket.emit("checkAndSendF", exid, resuser.account.id);
      }
    }
  });

  function faddsubmit() {
    try {
      let er = document.getElementById("faddusername").value.trim();
      socket.emit("userToIdF", er);
    } catch (e) {
      alert("There was an error: " + e);
    }
  }

  socket.on("userToIdResult", function (exid) {
    if (resuser.data.chats.some((e) => e.members.includes(exid))) {
      alertify.error("You already have a chat with this user!");
      return false;
    }

    if (exid == resuser.account.id) {
      alertify.error("What the hell, thats you.");
    } else {
      if (!exid) {
        alertify.error("User doesn't exist!");
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

  socket.on("removeFriendResponse", function (exid) {
    if (exid) {
      alertify.success("Friend Removed.");
    } else {
      alertify.error("There was an error.");
    }
  });

  function removeFriend(f) {
    document.getElementById("elem-" + f).outerHTML = "";
    socket.emit("removeFriend", resuser.account.id, f);
  }

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
  });*/

    socket.on("forceclose", function () {
      location.reload();
    });
  });
} catch (e) {
  alert("There is a problem. Please contact Aries!");
  console.log(e);
}
