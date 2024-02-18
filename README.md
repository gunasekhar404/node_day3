# Student-Mentor Api (Live Server Link Added in the About Section)

Packages Installed:

* Express

* Nodemon

* Dotenv

* Mongodb

Features:

* Create Mentor

* Create Student

* Assign multiple Students to a Mentor

* Assign a particular student to a mentor

* Change a mentor for a siparticularngle student

* View all the students assigned for a particular mentor

* View the previous mentor history for a particular student

Details for giving Data's:

Creating Mentor - mentor_name,status

Creating Student - student_name,status

Assigning multiple Students to Mentor - mentor_name,student_names[""]

Changing Mentor or Assigning Mentor for a particular student - mentor_name,student_name

Viewing all students for a particular mentor - mentor_name

Viewing previous mentor history for a particular student - student_name

API endpoints:

* / - to view all mentor data's

* /mentor - to create a mentor

* /student - to create a student

* /assignMentor - to assign multiple students for a particular mentor

* /changeMentor - to assign mentor for a particular student or to change mentor for a particular student

* /mentorStudents - to view all the students assigned for a particular mentor

* /history - to view the previous mentor history for a particular student


Conditions:

* Users cannot create another mentor with same name

* Users cannot create another student with same name

* All other conditions are user friendly and easy to understand...
