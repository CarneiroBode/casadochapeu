# Landing page estática — Casa do Chapéu Caparaó
# Servida por nginx não-root (porta 8080); TLS fica a cargo do Traefik/Dokploy.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx index.html robots.txt sitemap.xml site.webmanifest llms.txt favicon.ico google3b204857f9ec707f.html /usr/share/nginx/html/
COPY --chown=nginx:nginx assets/ /usr/share/nginx/html/assets/
COPY --chown=nginx:nginx styles/ /usr/share/nginx/html/styles/
COPY --chown=nginx:nginx lib/   /usr/share/nginx/html/lib/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
