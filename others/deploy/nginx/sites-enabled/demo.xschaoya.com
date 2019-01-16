server {
    charset utf-8;
    listen 443;
    server_name www.xschaoya.com,xschaoya.com;
    ssl on;
    ssl_certificate   /etc/nginx/cert/214231598310053.pem;
    ssl_certificate_key  /etc/nginx/cert/214231598310053.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    

    location /robots.txt {
        alias /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/robots.txt;
    }

    location /sitemap.xml {
        alias /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/sitemap.xml;
    }

    location /static {
        alias /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/static;
	access_log   off;
   	expires      1d;
    	add_header Cache-Control private;
    }     
         


    location / {
        proxy_set_header Host $host;
        proxy_pass http://unix:/tmp/demo.xschaoya.com.socket;
	proxy_intercept_errors on;
	proxy_set_header X-Real-IP      $remote_addr;
	proxy_set_header X-Forwarded-FOR $proxy_add_x_forwarded_for;
    } 

    error_page 404 = /404.html;
    location = /404.html {

        root /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/templates/error;

    }

    #location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
    #access_log   off;
    #expires      7d;
    #add_header Cache-Control private;
    #}


}

server {
    charset utf-8;
    listen 80;
    server_name www.xschaoya.com,xschaoya.com;
    rewrite ^(.*)$  https://$host$1 permanent;


    location /robots.txt {
        alias /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/robots.txt;
    }

    location /sitemap.xml {
        alias /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/sitemap.xml;
    }

    location /static {
        alias /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/static;
	access_log   off;
        expires      1d;
        add_header Cache-Control private;
    }



    location / {
        proxy_set_header Host $host;
        proxy_pass http://unix:/tmp/demo.xschaoya.com.socket;
	proxy_intercept_errors on;
	proxy_set_header X-Real-IP      $remote_addr;
        proxy_set_header X-Forwarded-FOR $proxy_add_x_forwarded_for;
    }
    
    error_page 404 = /404.html;
    location = /404.html {
    
        root /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/templates/error;
        
    }

    #location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
    #access_log   off;
    #expires      7d;
    #add_header Cache-Control private;
    #}
    
}

server {
    charset utf-8;
    listen 80;
    server_name docs.xschaoya.com;
    rewrite ^(.*)$  https://$host$1 permanent;
    
    location / { 
        index index.html;
    	root /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/docs;
    }   

    error_page 404 = /404.html;
    location = /404.html {

        root /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/templates/error;

    }


}

server {
    charset utf-8;
    listen 443;
    server_name docs.xschaoya.com;
    ssl on;
    ssl_certificate   /etc/nginx/cert/214252397480053.pem;
    ssl_certificate_key  /etc/nginx/cert/214252397480053.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;


    location / { 
	index index.html;
	root /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/docs;
    }  

    error_page 404 = /404.html;
    location = /404.html {

        root /home/dragon/sites/demo.xschaoya.com/MyFirstBlog/templates/error;

    }

}
