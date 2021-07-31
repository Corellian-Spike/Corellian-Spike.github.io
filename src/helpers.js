// by AurekFonts

const renderLinkHeader = () => {
  document.getElementById(`link-header`).innerHTML =
    `<span>
      <a href="index.html">[Home]</a>&nbsp;&nbsp;&nbsp;
    </span>
    <span>
      <a href="resources.html">[Resources]</a>&nbsp;&nbsp;&nbsp;
    </span>
    <span>
      <a href="./resources/rules/SabaccCorellianSpikeRules_v1.0.pdf">[Rulebook]</a>&nbsp;&nbsp;&nbsp;
    </span>
    <span>
      <a href="scorebot.html">[Score Calculator]</a>&nbsp;&nbsp;&nbsp;
    </span>`;
};

const renderHeaderImage = (size) => {
  document.getElementById(`header-image`).innerHTML = 
    `<a href="index.html">
      <img 
        src="assets/images/header-2020${size ? `-${size}` : ``}.png"
        alt="Corellian Spike" 
        title="Corellian Spike"
      />
    </a>`;
};