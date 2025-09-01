# Habito

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://migacz-dawid.github.io/habito-react-tailwindcss/) 

**Habito to prosty i elegancki tracker nawyków, który pomaga użytkownikom budować codzienne zwycięstwa bez zbędnego stresu, oferując czytelny interfejs, tryb ciemny i wsparcie wielojęzyczne.** 
Aby ułatwić symulację działania aplikacji, dodano przycisk **„Zakończ dzień”**, który pozwala szybko przejść do kolejnego dnia i sprawdzić, jak aplikacja reaguje w dalszym ciągu – bez potrzeby czekania na rzeczywisty upływ czasu.

Projekt ma trzy warstwy testów: **unit (Vitest)**, **E2E (Playwright)** oraz **visual regression (Playwright)**.

- **Unit (Vitest)** – testują logikę (np. filtry, sortowanie, walidacje, hooki) w odseparowaniu od UI.
- **E2E (Playwright)** – sprawdzają kluczowe ścieżki użytkownika na prawdziwej przeglądarce (happy path + podstawowe edge case’y).
- **Visual regression (Playwright)** – pilnują, aby wygląd kluczowych ekranów nie zmienił się niechcący (desktop light/dark + mobile).

---

## 🔗 Demo  
👉 [Zobacz stronę na żywo](https://migacz-dawid.github.io/habito-react-tailwindcss/)  

---

## 📑 Spis treści
1. [Opis projektu](#description)  
2. [Główne zalety](#advantages)  
4. [Technologie](#technologies)  
5. [Biblioteki i narzędzia](#libraries)
6. [Funkcjonalności](#functionalities)
7. [Instalacja](#instalation)
8. [Testy](#tests)
9. [Deployment (GitHub Pages)](#deployment) 
10. [Użytkowanie](#use)  

---
## <a name="description"></a>🔍 Opis projektu
**Twoje cele. Twoje tempo. Twoje zasady.**  
Ta aplikacja powstała z myślą o wszystkich, którzy chcą coś zmienić – ale bez presji, spiny i miliona nieczytelnych opcji. Niezależnie od tego, czy chcesz codziennie pić więcej wody, w końcu zacząć ćwiczyć, czy po prostu pamiętać, że poniedziałek to nie koniec świata – jesteś w dobrym miejscu.

- 📅 Wybierz dni, w które chcesz działać  
- 🗂️ Przypisz kategorię, żeby wszystko było uporządkowane  
- ✍️ Dodaj opis, jeśli chcesz sobie dodać motywacji  
- ✅ A potem już tylko wracaj i odhaczaj postępy  

Intuicyjny wygląd, przyjazny interfejs, ciemny tryb dla nocnych sów – wszystko, czego potrzeba, by w końcu zacząć i nie przestać.  
> *Nie musisz być perfekcyjny, żeby być konsekwentny.*  
> *To nie kolejna apka do zarządzania życiem. To Twoja osobista przestrzeń do małych (i dużych) zwycięstw.*

---

## <a name="advantages"></a>💼 Główne zalety
- **Responsywność i mobile-first** – projektowane UI działają płynnie na każdym urządzeniu.  
- **PWA z wsparciem offline** – użytkownicy mogą korzystać nawet bez połączenia z internetem.  
- **Wielojęzyczność (i18next)** – szybkie przełączanie między wersją polską i angielską.  
- **Dark Mode z lokalnym przechowywaniem preferencji** – przyjazne dla oczu i dostosowane do rytmu dnia.  
- **Optymalizacja wydajności** – dzięki Vite, lazy-loading i zoptymalizowanym bundle’om.  
- **Animacje i wizualizacje danych** – płynne efekty z framer-motion oraz interaktywne wykresy z @nivo i recharts.  

---


## <a name="technologies"></a>💻 Technologie
- Vite  
- React  
- Tailwind CSS  
- JavaScript (ES6+)  
- HTML5  

---

## <a name="libraries"></a>🔧 Biblioteki i narzędzia
- **react-icons** – ikony wektorowe w React  
- **framer-motion** – zaawansowane animacje  
- **react-confetti** – efekt konfetti po ukończeniu wyzwania  
- **recharts** – proste wykresy liniowe i słupkowe  
- **@nivo/calendar**, **@nivo/bar**, **@nivo/line** – wizualizacje kalendarzowe i wykresy  
- **usehooks-ts** – gotowe hooki TypeScript  
- **use-local-storage** – łatwe przechowywanie stanu w localStorage  
- **theme-toggles** – gotowe przełączniki motywów  

---

## <a name="functionalities"></a>🌟 Funkcjonalności
- PWA (offline, instalacja na pulpit)  
- Dark Mode z przełącznikiem  
- Wielojęzyczność (i18next: PL/EN)  
- Animacje (framer-motion, react-confetti)  
- Wykresy i wizualizacje (recharts, @nivo/calendar, @nivo/bar, @nivo/line)  
- Zarządzanie stanem i lokalne przechowywanie (usehooks-ts, use-local-storage)  


---
## <a name="instalation"></a>🚀 Instalacja
1. Sklonuj repozytorium  
   ```bash
   git clone https://github.com/migacz-dawid/habito-react-tailwindcss
  
2. Przejdź do katalogu projektu: 
   ```bash
   cd habito-react-tailwindcss

3. Zainstaluj zależności:  
   ```bash
   npm install
  
4. Uruchom w trybie deweloperskim: 
   ```bash
   npm run dev

---
## <a name="tests"></a>🧪 Testy
1. Testy jednostkowe (Vitest)  
   ```bash
   npm run test
  
2. Testy E2E (Playwright) 
   ```bash
   npm run test:e2e
  
3. Testy E2E (Playwright)  – Tryb UI czyli interaktywne uruchamianie/debug
   ```bash
   npm run test:e2e:ui
  
4. Testy E2E (Playwright)  – Tryb headed czyli przeglądarka z oknem
   ```bash
   npm run test:e2e:headed
  
5. Testy wizualne (Playwright) – desktop + mobile 
   ```bash
   npm run test:visual
  
6. Pełny zestaw testów
   ```bash
   npm run test:all

---

## <a name="deployment"></a>📦 Deployment (GitHub Pages)
Po uruchomieniu `npm run build` pliki produkcyjne tworzone są bezpośrednio w katalogu `docs/`, który GitHub Pages traktuje jako źródło demo.

1. Zbuduj aplikację:
   ```bash
   npm run build

---

## <a name="use"></a>🧑‍💻 Użytkowanie
1. Otwórz aplikację  
2. Przełącz Dark/Light mode w prawym górnym rogu.  
3. Wybierz dni i kategorie dla swoich nawyków.  
4. Po zakończeniu dnia wróć i odhacz postępy.  
5. Przełącz język za pomocą przycisku PL/EN.  
