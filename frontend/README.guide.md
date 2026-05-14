# Theme template – vodič za razvoj i širenje

Ovaj dokument objašnjava kako tema funkcioniše iznutra, kako se pokreće, te koje su tačke proširenja. Nakon što prođeš kroz vodič, moći ćeš da dodaš nove stranice, komponente i konfiguracije bez lutanja kroz kod.

## 1. Priprema okruženja
- **Node 18+**: provjeri verziju komandom `node -v`.
- **Zavisnosti**: pokreni `npm install`.
- **Okruženje**: kopiraj `.env.example` u `.env` i prilagodi:
  - `VITE_APP_NAME` – naziv aplikacije koji se prikazuje u `AppLogo`.
  - `VITE_BASE_URL` – baza za statičke resurse (npr. kada aplikacija ide na podputanju).
  - `VITE_USE_HASH_ROUTE` – `true` ako se deploy radi na okruženju bez podešenog server-side routinga (npr. GitHub Pages), inače `false`.

## 2. Ključne skripte
| Komanda | Kada je koristiti |
| --- | --- |
| `npm run dev` | Lokalni razvoj na `http://localhost:5173`. |
| `npm run build` | Produkcijski build u `dist/`. |
| `npm run preview` | Testiranje buildu nakon `npm run build`. |

Za GitHub Pages deploy koristi korake opisane u originalnom `README.md` (`basenameProd`, `GITHUB_TOKEN`, workflow).

## 3. Kako aplikacija radi
1. **Ulazna tačka** – `src/main.tsx` renderuje `App` unutar React `StrictMode`.
2. **Router** – `src/App.tsx` bira između `BrowserRouter` i `HashRouter` (zavisno od `VITE_USE_HASH_ROUTE`) i obmotava sve u `ThemeProvider`.
3. **Struktura stranica** – `src/Router.tsx` postavlja rute. Sve privatne/navigacione stranice su unutar jedne `Route` grupe gdje se renderuje `AppLayout`.
4. **Layout** – `src/components/app/layout/app-layout.tsx` drži `AppHeader`, `Outlet` (aktuelna stranica) i `AppFooter`. Zato gotovo sve promjene u globalnom rasporedu idu ovdje.
5. **Navigacija** – `mainMenu` iz `src/config/menu.ts` koristi se i u `AppHeader` i u `AppSidebar`, tako da svaka promjena menija ide u jednom fajlu.
6. **Tema** – `src/contexts/ThemeContext.tsx` snima izbor (`light`, `dark`, `system`) u `localStorage`, postavlja `class` na `<html>` i izlaže `useTheme` hook. `ModeToggle` komponenta ga koristi preko dropdown-a.
7. **UI kit** – `src/components/ui/*` sadrži sve shadcn/ui komponente koje koristiš lokalno (Button, Card, Table, Sidebar, Sheet, Tooltip…). Ako dodaš novu shadcn komponentu, ulazi u ovaj folder.
8. **Specijalizovane komponente** – `DataTable`, `ButtonShowcase`, `PageHeader`, `AppHeader` (sa dropdown-ovima), `AppSidebar` (mobilni meni) su napravljene da ubrzaju ponovnu upotrebu.

## 4. Struktura `src` foldera
| Folder / fajl | Namjena | Napomena |
| --- | --- | --- |
| `components/` | Reusable blokovi (`app/`, `common/`, `routing/`, `sections/`, `ui/`). | `app/` drži App layout/navigaciju, `routing/` čuva `ProtectedRoute`, dok `ui/` sadrži shadcn kit. |
| `config/` | Centralna konfiguracija (npr. `appConfig`, `mainMenu`). | Dodaj nove konfiguracije ovdje da bi bile lako dostupne. |
| `contexts/ThemeContext.tsx` | Globalni context za temu. | Wrap-uje `App` i omogućava `useTheme`. |
| `hooks/use-mobile.ts` | Detekcija mobile width-a. | Koristi se u `AppSidebar`. Dodaj nove custom hook-ove u ovaj folder. |
| `lib/utils.ts` | `cn` helper (clsx + tailwind-merge). | Zadrži ovdje sve util funkcije. |
| `pages/` | Sve route-page komponente. | Podfolder `pages/components` je showcase UI stranica. |
| `App.tsx`, `Router.tsx`, `main.tsx` | Ulaz, routing i mount. | Tipično ne mijenjaš `main.tsx`, već `Router` i `AppLayout`. |
| `index.css` | Tailwind bazne stilove, fontove i custom util klase. | Dodatne theme varijable ili globalne klase dodaj ovdje. |

## 5. Dodavanje nove stranice
1. Kreiraj komponentu u `src/pages` (npr. `Analytics.tsx`). Koristi `PageHeader` i shadcn UI komponente po potrebi.
2. U `src/Router.tsx` dodaj rutu:
   ```tsx
   <Route path="analytics" element={<Analytics />} />
   ```
3. Ako treba link u meniju, proširi `mainMenu` u `src/config/menu.ts`:
   ```ts
   {
     title: "Analytics",
     url: "/analytics",
     icon: LineChart
   }
   ```
4. (Opcionalno) Dodaj showcase komponentu ili pomoćne blokove u `src/components/` ako ćeš ih više puta koristiti.

## 6. Proširenje UI komponenti
1. **Preko shadcn CLI-ja** – u `components.json` već postoji konfiguracija. Pokreni `npx shadcn-ui@latest add <component>` da uvezeš novu komponentu u `src/components/ui`.
2. **Lokalne varijante** – ako trebaš specifičnu varijantu (npr. novi `Button` stil), proširi `buttonVariants` u `src/components/ui/button.tsx`.
3. **Globalne boje/spacing** – mijenjaj Tailwind varijable u `index.css` ili Tailwind konfiguraciji ako je dodaš.
4. **Ikone** – custom ikone drži u `src/components/icons`. Za nove ikone (npr. iz `lucide-react`) dovoljno je importovati ih direktno u komponentama.

## 7. Tema, tipografija i responsivnost
- **Tema**: koristi `data-slot` i Tailwind `dark:` klase koje su već pripremljene u shadcn komponentama. Kada dodaješ novu komponentu, prati isti pattern (`className={cn("...")}`).
- **Responsivnost**: `AppHeader` koristi desktop meni, `AppSidebar` + `Popover` preuzimaju na mobilu (`useIsMobile`). Ako dodaješ nove nav elemente, obrati pažnju na oba scenarija.
- **Layout širine**: većina stranica koristi wrapper `max-w-7xl mx-auto px-4 md:px-8`. Drži se istog kontejnera da zadržiš konzistentan izgled.

## 8. Tips & Tricks
- **Konfigurabilnost**: `appConfig` i `mainMenu` su ti centralne tačke – jedna promjena se automatski reflektuje kroz header, sidebar i footer.
- **Testiranje**: prije commita pokreni `npm run build` da uhvatiš TypeScript/Tailwind greške.
- **Kod stil**: projekt koristi ESLint (konfig u `eslint.config.js`). Ako dodaš nove fajlove, importi treba da budu putem `@/` aliasa kad god je moguće (`tsconfig` već ima `paths`).
- **Deploy**: za GitHub Pages koristi `npm run build` + workflow `Build & Deploy`. Ako deployaš na drugi hosting, samo posluži sadržaj `dist/`.

Sa ovim vodičem imaš pregled šta se gdje nalazi, kako su stvari povezane i koje korake treba ispratiti da bi proširio temu. Možeš ga držati otvorenog dok razvijaš nove sekcije kao podsjetnik na preporuke i tok rada.
