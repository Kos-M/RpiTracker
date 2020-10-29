const menu = document.querySelector(".menu");
const disconnect = document.querySelector(".menu-disconnect");
const shutdown = document.querySelector(".menu-shutdown");
const reboot = document.querySelector(".menu-reboot");
const halt = document.querySelector(".menu-halt");
let target = null;
let menuVisible = false;
function sendAction(e, target, action) {
  $.post(
    "/action",
    { do: action, id: target.parentNode.cells[6].innerText },
    (res, err) => {}
  );
}
const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};
const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};
window.addEventListener("click", (e) => {
  if (menuVisible) toggleMenu("hide");
});
const Reboot_callback = function (e) {
  sendAction(e, target, Protocol.DO_REBOOT);
};
const Halt_callback = function (e) {
  sendAction(e, target, Protocol.DO_HALT);
};
const Disconnect_callback = function (e) {
  sendAction(e, target, Protocol.DisConnect);
};
const Shutdown_callback = function (e) {
  sendAction(e, target, Protocol.DO_SHUTDOWN);
};
window.addEventListener("contextmenu", (e) => {
  reboot.removeEventListener("click", Reboot_callback);
  disconnect.removeEventListener("click", Disconnect_callback);
  shutdown.removeEventListener("click", Shutdown_callback);
  halt.removeEventListener("click", Halt_callback);
  const origin = {
    left: e.pageX,
    top: e.pageY,
  };
  target = e.target;
  if (target.nodeName === "TD") {
    e.preventDefault();
    setPosition(origin);
  }
  reboot.addEventListener("click", Reboot_callback);
  disconnect.addEventListener("click", Disconnect_callback);
  shutdown.addEventListener("click", Shutdown_callback);
  halt.addEventListener("click", Halt_callback);
  return false;
});
