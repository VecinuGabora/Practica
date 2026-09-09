A zis că localStorage-ul merge din cutie, dar a uitat ca la prima cheie goala da undefined și ia tot scriptul la un simplu refresh.

La logica cu pragul de 340 MDL, formula propusă de el scadea direct din zero și îmi scria în interfata „mai ai nevoie de -340 MDL”.

M-a asigurat că un setInterval simplu ține timerul pentru livrare, dar de fiecare dată când schimbam tab-ul între catalog și coș se reseta cronometrul de la zero pentru că pierdea starea DOM-ului.

A pus pe butonul de checkout un simplu disabled,fara o opacitate sau un cursor de not-allowed, asa că arata la fel de apasabil desi logica il bloca.

A omis legatura fină dintre starea subtotalului si activarea butonului de plata, asa ca initial puteam da comanda și cu 10 lei în cos.

La butoanele de plus/minus din coș, funcția de decrementare dată de el ștergea direct tot produsul din memorie la primul click, în loc să scada doar cantitatea cu -1.

Cea mai mare minciună a fost că totul e gata și merge din prima, cand de fapt a trebuit sa iau fiecare eroare la rand direct în browser. 