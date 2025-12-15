# Generator PDF files

````
Microservice for generating pdf files
in app/page/views there are templates for generating files:
-account_confirmation
-instruction

1 POST /api/generator_pdf/:type where type is one of the views templates
2 we get a link in the response and go to GET /api/generator_pdf/:type
3 The pdf file stream opens
-
1a POST /api/generator_pdf/:type?file=base64
2a we get a link in the response and go to GET /api/generator_pdf_base/:type
3a the file download starts
````

