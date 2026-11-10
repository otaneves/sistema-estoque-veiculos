package com.concessionaria.estoque;

import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
class FrontendLocal {
    private Process vite;

    @EventListener(ApplicationReadyEvent.class)
    void iniciar() throws Exception {
        Path classes = Path.of(getClass().getProtectionDomain().getCodeSource().getLocation().toURI());
        if (!Files.isDirectory(classes)) return;
        for (Path dir = classes; dir != null; dir = dir.getParent()) {
            Path frontend = dir.resolve("frontend");
            if (!Files.isRegularFile(frontend.resolve("package.json"))) continue;
            if (catalogoDisponivel()) return;
            Path script = frontend.resolve("node_modules/vite/bin/vite.js");
            if (!Files.isRegularFile(script)) throw new IOException("Execute npm install na pasta frontend.");
            vite = new ProcessBuilder("node", script.toString(), "--host", "127.0.0.1",
                    "--port", "80", "--strictPort").directory(frontend.toFile()).inheritIO().start();
            for (int tentativa = 0; tentativa < 50 && vite.isAlive(); tentativa++) {
                if (catalogoDisponivel()) return;
                Thread.sleep(200);
            }
            throw new IOException("O catálogo não iniciou. Confira a saída do Vite e a porta 80.");
        }
    }

    private boolean catalogoDisponivel() throws InterruptedException {
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1/"))
                .timeout(Duration.ofSeconds(1)).GET().build();
        try {
            var resposta = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            return resposta.statusCode() == 200 && resposta.body().contains("<title>Concessionária Luizon</title>");
        } catch (IOException indisponivel) {
            return false;
        }
    }

    @PreDestroy
    void parar() {
        if (vite != null) vite.destroy();
    }
}