RESTful routes

name    url                                 verb            desc.

INDEX   /campgrounds                        GET             Display a list of all camps
NEW     /campgrounds/new    
CREATE  /campgrounds
SHOW    /campgrounds/:id

NEW     /campgrounds/:id/comments/new       GET
CREATE  /campgrounds/:id/comments           POST    