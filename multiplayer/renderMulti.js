import { $boardSection } from "../main.js";

const renderRoomInfo = (playerNames, room, name, currentWebRoom) => {
  $boardSection.innerHTML= '<img src="./img/azul-box-cover.jpg">';
  const element = document.createElement('div');
  if (playerNames) {
    element.innerHTML = `
      <h3>Room # ${room}</h3>
      ${playerNames.reduce((total, current) => {
        return total + `<h5>${current}</h5>`
      })}
    `
    currentWebRoom = [...playerNames];
  element.classList.add('roomInfo');
  $boardSection.appendChild(element);
  } 
}

export { renderRoomInfo }