# AI-LOG

**Data:** 9 Septembrie 2026

Commit 1:
**Task curent:** Generarea scheletului proiectului cu Vite.
**Răspuns/Implementare:** S-a ales Vanilla JS cu Vite pentru a respecta regula de maxim 3 comenzi pentru rulare. S-a curățat codul de bază și s-a făcut setup-ul Git.

Commit 2:
**Task curent:** Crearea structurii vizuale și a navigării în 3 pași.
**Implementare:** S-a creat interfata profesională structurată în trei secțiuni (`#catalog-screen`, `#cart-screen`, `#checkout-screen`) bazata pe clase CSS si tranzitii. S-a scris funcția JS de navigare libera între ecrane.

Commit 3:
**Task curent:** Popularea catalogului si logica cosului cu persistența locala.
**Implementare:** S-a adaugat baza de date falsă cu produse, randarea dinamica a cardurilor in DOM, gestionarea cantitatilor pe unitati de vanzare si s-a integrat `localStorage` pentru ca starea cosului sa supravietuiasca la un refresh de pagina.

Commit 4:
**Task curent:** Validarea pragului minim de comandă și cronometrul pentru livrare.
**Implementare:** S-a implementat logica de verificare a pragului de 340 MDL (dacă subtotalul este mai mic, butonul de checkout este dezactivat și se afișează mesajul dinamic cu suma exactă lipsă). S-a adaugat si cronometrul bazat pe `setInterval` care scade secunda cu secunda pe ecranul de confirmare.

Commit 5:
**Task:** Finalizarea documentatiei (README, AI-LOG, RETRO).
**Implementare:** S-au adaugat fisierele de documentatie cerute de standardele academice.

##Tool-ul Folosit
Google Gemini

Vreau să construim o aplicație web frontend bazată pe Vanilla HTML, CSS și JavaScript. Aplicația este un flux de comandă pentru un local și trebuie să respecte cerințele: 3 pași (Catalog, Coș, Confirmare) cu întoarcere liberă, coș persistent prin localStorage, validare prag minim de 340 MDL cu mesaj dinamic, cronometru real de livrare, și o structură curată


##Cele 3 Prompturi Care au Contat Cel Mai Mult

"Vreau să implementăm structura vizuală în 3 ecrane separate cu tranziții fade-in și o navigare curată în JavaScript, pregătită pentru Commit-ul 2."

"Adaugă logica pentru catalogul de produse dinamice, gestionarea cantităților pe unități de vânzare și persistența datelor cu localStorage care supraviețuiește unui refresh."

"Implementează validarea strictă pentru pragul de 340 MDL (dacă subtotalul e mai mic, dezactivează butonul de checkout și afișează suma exactă lipsă) și adaugă cronometrul real cu setInterval pe ecranul de confirmare."


##Cazuri în care AI-ul a Greșit și Cum Am Realizat

Comasarea codului în loc de commit-uri separate: AI-ul a insistat la început să pun tot codul din aplicație într-un singur fișier mare, ceea ce mi-ar fi stricat cele 5 commit-uri curate cerute la evaluare. Mi-am dat seama când am văzut că nu respectă structura incrementală stabilită și am refăcut pasul cu reset local.

Eroarea de calcul la pragul minim pentru coș gol: La pragul minim de 340 MDL, formula propusă de AI scădea direct din zero și afișa mesaje absurde de genul „mai ai nevoie de -340 MDL”. Am realizat asta testând direct în browser cu coșul gol și am corectat condiția în cod.

Resetarea cronometrului la navigare: Mi-a zis că timerul de livrare va rula fluid cu un setInterval simplu, dar de fiecare dată când schimbam tab-ul între catalog și coș se reseta cronometrul de la zero pentru că pierdea starea DOM-ului. Am observat comportamentul la prima simulare de click și am fixat o țintă globală de timp (targetTime).


##Ce am scris de mână fără AI și de ce

Am scris de mână designul vizual din CSS (layout-ul grid pentru catalog, spațierile, umbrele și stilizarea elementelor interactive) și am configurat manual datele din meniul de produse. De ce? Pentru că stilurile generate inițial de AI păreau un șablon oarecare de pe internet, cu un aspect destul de sec; a trebuit să modific manual culorile, padding-urile și efectele de hover ca interfața să arate a aplicație de food delivery modernă și curată, ajustând totodată prețurile în MDL și denumirile produselor (burgeri, pizza, limonadă) pentru a da un aspect cât mai realist proiectului.


##Ce aș face altfel în primele 10 minute dacă aș relua

Aș stabili de la început ordinea fișierelor și aș testa cazurile limită (coș gol, valori la limită de 340 MDL) înainte să mă apuc de stilizarea CSS, ca să evit rescrierea logicii de validare din mers.