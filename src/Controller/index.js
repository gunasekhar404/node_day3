import { ObjectId } from "mongodb";
import { client } from "../../db.js";

//TO CREATE MENTOR
export function creatingMentor(mentorData){
    return client.db("Mentor-Student").collection("mentor").insertOne(mentorData);
}

//TO CREATE STUDENT
export function creatingStudent(studentData){
    return client.db("Mentor-Student").collection("student").insertOne(studentData);
}

//TO ASSIGN A MENTOR FOR MULTIPLE STUDENTS
//to find and change mentor status
export function findMentorAndStatusUpdate(mentorName){
    return client.db("Mentor-Student").collection("mentor").findOneAndUpdate({mentor_name:mentorName},{$set:{status:"Assigned"}});
}
//find and change student status
export function findStudentAndStatusUpdate(studentName){
    return client.db("Mentor-Student").collection("student").findOneAndUpdate({student_name:studentName},{$set:{status:"Assigned"}});
}
//find mentor
export function findMentor(mentorName){
    return client.db("Mentor-Student").collection("mentor").findOne({mentor_name:mentorName});
}
//find student
export function findStudent(students){
    return client.db("Mentor-Student").collection("student").findOne({student_name:students});
}
//adding students to the mentor
export function addStudentsToMentor(id,finalData){
    return client.db("Mentor-Student").collection("mentor").findOneAndReplace({_id:new ObjectId(id)},finalData);
}
//find not assigned students
export function unAssignedStudents(){
    return client.db("Mentor-Student").collection("student").find({status:"Not Assigned"}).toArray();
}

//TO ASSIGN OR CHANGE FOR SINGLE STUDENT
//find mentor
export function findingMentor(mentorName){
    return client.db("Mentor-Student").collection("mentor").findOne({mentor_name:mentorName});
}
//find student
export function findingStudent(students){
    return client.db("Mentor-Student").collection("student").findOne({student_name:students});
}
//check mentor for a student
export function checkStudentMentor(name){
    return client.db("Mentor-Student").collection("mentor").find({"students.student_name":name}).toArray();
}
//removing and changing status for a mentor
export function updatingMentor(id,finalData){
    return client.db("Mentor-Student").collection("mentor").findOneAndReplace({_id:new ObjectId(id)},finalData)
}
//storing mentor details
export function storingMentorDetails(data){
    return client.db("Mentor-Student").collection("history").insertOne(data);
}

//STUDENTS FOR PARTICULAR MENTOR
//finding students
export function findingMentorStudents(name){
    return client.db("Mentor-Student").collection("mentor").findOne({mentor_name:name})
}

//GET ALL FOR HOME PAGE
export function getAllData(){
    return client.db("Mentor-Student").collection("mentor").find({}).toArray();
}

//MENTOR HISTER OF STUDENT
//getting mentor data's
export function getAllMentorData(name){
    return client.db("Mentor-Student").collection("history").find({"students.student_name":name}).toArray();
}
