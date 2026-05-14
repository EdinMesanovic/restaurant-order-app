// Globalni dizajn konfiguracije za layout i komponente.
//
// Sve vrijednosti su Tailwind CSS klase koje možeš koristiti
// u layoutu da osiguraš konzistentan dizajn kroz cijelu aplikaciju.

export const themeConfig = {
  // Maksimalna širina stranice:
  // max-w-7xl = 80rem = 1280px.
  // Ovo drži sadržaj u centru i sprečava da bude preširoko
  // na velikim monitorima.
  containerWidth: "max-w-7xl",

  // Horizontalni padding koji dobijaju sve stranice/sekcije.
  // px-4 = 16px padding na mobitelu
  // md:px-8 = 32px padding na tabletima i desktop uređajima
  pagePadding: "px-4 md:px-8",

  // Globalni border-radius koji koristiš na karticama, boxovima itd.
  // rounded-xl = 0.75rem = 12px
  // Možeš promijeniti jedan value i promijeniti stil cijele aplikacije.
  borderRadius: "rounded-xl",
};
