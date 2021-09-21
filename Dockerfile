FROM wordpress:5.7-php7.3 as dev

RUN ln -s /app/microsoft-news /var/www/html/wp-content/plugins/microsoft-news

RUN docker-php-ext-install pcntl
RUN pecl install -f xdebug

RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
RUN echo '\n\
[Xdebug]\n\
xdebug.mode = debug\n\
xdebug.start_with_request = yes\n\
xdebug.client_host=host.docker.internal\n\
xdebug.remote_port=9000\n\
xdebug.client_port = 9000\n\
zend_extension="xdebug.so"\n\
xdebug.profiler_enable_trigger=1\n\
xdebug.profiler_enable = 0\n\
xdebug.remote_enable = 1\n\
xdebug.log = /tmp/xdebug.log\n\
xdebug.profiler_output_dir = "/tmp"' >> /usr/local/etc/php/php.ini

# composer and npm
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh

RUN apt update && apt install -y \
    unzip \
    nodejs

# RUN curl -sS https://getcomposer.org/installer -o composer-setup.php && \
#     php composer-setup.php --install-dir=/usr/local/bin --filename=composer
COPY ./deps/composer /usr/local/bin

RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp
RUN chmod +x /usr/local/bin/wp
