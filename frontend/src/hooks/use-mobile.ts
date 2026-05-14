import * as React from "react";

// Breakpoint vrijednost: sve ispod 768px se smatra "mobile"
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // State koji čuva informaciju da li je ekran mobilne širine.
  // Početna vrijednost je undefined dok se ne izvrši provjera u useEffect-u.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // Kreiramo MediaQueryList koji prati kada je širina prozora manja od 768px.
    // (max-width: 767px)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Funkcija koja se pokreće svaki put kad se promijeni media query stanje,
    // npr. kad user resize-a prozor pa pređe ispod/iznad breakpointa.
    const onChange = () => {
      // Postavljamo isMobile na osnovu trenutne širine prozora.
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Registrujemo event listener da "sluša" promjene širine ekrana.
    mql.addEventListener("change", onChange);

    // Prva provjera odmah po mountu — da odmah znamo da li je mobile ili ne.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup funkcija: uklanja listener kad se komponenta unmounta.
    return () => mql.removeEventListener("change", onChange);
  }, []); // Prazan array znači da se effect pokreće samo jednom, na mountu.

  // Vraćamo uvijek boolean (true/false).
  // Ako je undefined (prije prve provjere), !!undefined postaje false.
  return !!isMobile;
}
