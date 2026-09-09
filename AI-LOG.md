# AI-LOG

**Data:** 9 Septembrie 2026
**Task curent:** Generarea scheletului proiectului cu Vite.
**Răspuns/Implementare:** S-a ales Vanilla JS cu Vite pentru a respecta regula de maxim 3 comenzi pentru rulare. S-a curățat codul de bază și s-a făcut setup-ul Git.


**Task curent:** Crearea structurii vizuale și a navigării în 3 pași.
**Implementare:** S-a creat interfata profesională structurată în trei secțiuni (`#catalog-screen`, `#cart-screen`, `#checkout-screen`) bazata pe clase CSS si tranzitii. S-a scris funcția JS de navigare libera între ecrane.


**Task curent:** Popularea catalogului si logica cosului cu persistența locala.
**Implementare:** S-a adaugat baza de date falsă cu produse, randarea dinamica a cardurilor in DOM, gestionarea cantitatilor pe unitati de vanzare si s-a integrat `localStorage` pentru ca starea cosului sa supravietuiasca la un refresh de pagina.


**Task curent:** Validarea pragului minim de comandă și cronometrul pentru livrare.
**Implementare:** S-a implementat logica de verificare a pragului de 340 MDL (dacă subtotalul este mai mic, butonul de checkout este dezactivat și se afișează mesajul dinamic cu suma exactă lipsă). S-a adaugat si cronometrul bazat pe `setInterval` care scade secunda cu secunda pe ecranul de confirmare.