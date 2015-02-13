(function () {
    registerAction(function (node) {
        if (!settings["newLines"]) return;

        if (node === undefined) {
            document.addEventListener('keypress', function (e) {
                if (e.keyCode == 13 && e.target.nodeName === "TEXTAREA" && e.target.matches(".editentryform textarea, .commentform textarea")) {
                    if (e.shiftKey) {
                        e.stopPropagation();
                    } else {
                        e.target.value = e.target.value.replace(/^\n+/, "").replace(/\n+$/, "").replace(/\n/g, "\u2000");
                    }
                }
            }, true);

            document.addEventListener('submit', function (e) {
                var txtA = e.target.querySelector("textarea[name='body']");
                if (txtA && txtA.matches(".editentryform textarea, .commentform textarea")) {
                    txtA.value = txtA.value.replace(/^\n+/, "").replace(/\n+$/, "").replace(/\n/g, "\u2000");
                }
            }, true);

        }

        node = node || document.body;

        toArray(node.querySelectorAll(".comment .content, .entry .text")).forEach(function (node) {
            var c = node.firstChild, changed = false;
            while (c) {
                if (c.nodeType == Node.TEXT_NODE && /\u2000/.test(c.nodeValue)) {
                    changed = true;
                    var fr = document.createDocumentFragment(),
                        nEmpties = 0;

                    c.nodeValue.split(/[ \t]*\u2000[ \t]*/).forEach(function (line) {
                        nEmpties = (line === "") ? nEmpties + 1 : 0;
                        if (nEmpties > 1) return;
                        if (line !== "") fr.appendChild(document.createTextNode(line));
                        fr.appendChild(document.createElement("br"));
                    });

                    fr.removeChild(fr.lastChild);
                    node.insertBefore(fr, c);
                    var lastCh = c.previousSibling;
                    node.removeChild(c);
                    c = lastCh;
                }
                c = c.nextSibling;
            }
            if (changed) node.normalize();
        });

        toArray(node.querySelectorAll(".editentryform textarea, .commentform textarea")).forEach(function (node) {
            node.value = node.value.replace(/\u2000/g, "\n");
        });

    });
})();
