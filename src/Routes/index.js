import express from "express";
import { addStudentsToMentor, checkStudentMentor, creatingMentor, creatingStudent, findMentor, findMentorAndStatusUpdate, findStudent, findStudentAndStatusUpdate, findingMentor, findingMentorStudents, findingStudent, getAllData, getAllMentorData, storingMentorDetails, unAssignedStudents, updatingMentor } from "../Controller/index.js";

//using express.Router
const router=express.Router();

//to create mentor
router.post("/mentor",async(req,res)=>{
    try {
        //if there is no data entered it will show error
        if(Object.keys.length<=0){
            res.send(500).json({error:"Add details of the mentor to proceed"})
        }
        //checking if there is already a mentor with the same name
        const checkMentorName=await findMentor(req.body.mentor_name);
        if(checkMentorName){
           res.status(400).json({error:"Mentor Name already registered"})
        }else{
            const mentorData=req.body;
            //creating mentor
            const mentorCreation=await creatingMentor(mentorData);
            if(!mentorCreation.acknowledged){
                return res.status(400).json({error:"error in creating mentor"})
            }
            res.status(201).json({data:mentorCreation});
        }    
    } catch (error) {
        console.log("error getting")
        res.status(500).json({error,})
    }
})

//to create student
router.post("/student",async(req,res)=>{
    try {
        //if there is no data entered it will show error
        if(Object.keys.length<=0){
            res.send(500).json({error:"Add details of the student to proceed"})
        }
        //checking if there is already a student with the same name
        const checkStudentName=await findStudent(req.body.student_name);
        if(checkStudentName){
            res.status(400).json({error:"Student Name already registered"})
        }else{
            const studentData=req.body;
            //creating student
            const studentCreation=await creatingStudent(studentData);
            if(!studentCreation.acknowledged){
                return res.status(400).json({error:"error in creating student"})
            }
            res.status(201).json({data:studentCreation});
        }
    } catch (error) {
        console.log("error getting")
        res.status(500).json({error,})
    }
})

//to assign a mentor for multiple students
router.post("/assignMentor",async(req,res)=>{
    try {
        //if there is no data entered it will show error
        if(Object.keys.length<=0){
            res.send(500).json({error:"Add details of the mentor and student to proceed"})
        }
        const data=req.body;

        //finding mentor and changing mentor status to assigned
        const mentor=req.body.mentor_name;
        const mentorStatusUpdate=await findMentorAndStatusUpdate(mentor);

        //finding student and changing student status to assigned
        const students=req.body.student_names;
        for(let i=0;i<students.length;i++){
            const studentStatusUpdate=await findStudentAndStatusUpdate(students[i]);
        }
        
        //finding mentor and students and storing it 
        const mentorData=await findMentor(mentor);
        const studentsArray=[];
        for(let i=0;i<students.length;i++){
            const studentsData=await findStudent(students[i]);
            studentsArray.push(studentsData);
        }

        //adding students list to the assigned mentor
        const finalData={...mentorData,students:studentsArray}
        const finalChange=await addStudentsToMentor(finalData._id,finalData);

        //find the students with status as Not Assigned and storing the students name in a array
        const findUnAssignedStudents=await unAssignedStudents();
        const unAssignedStudentsList=[];
        for(let i=0;i<findUnAssignedStudents.length;i++){
            unAssignedStudentsList.push(findUnAssignedStudents[i].student_name);
        }
        //sending response as assigned mentor with students and unassignedstudents list
        res.status(200).json({Assigned:finalData,UnAssignedStudents:unAssignedStudentsList});
    } catch (error) {
        console.log(error)
        res.status(500).json({error,})
    }
})
export default router;

//assigning or changing mentor for a single student
router.post("/changeMentor",async(req,res)=>{
    try {
         //if there is no data entered it will show error
         if(Object.keys.length<=0){
            res.send(500).json({error:"Add details of the mentor and student to proceed"})
        }
        const data=req.body;
        const checkMentorName=await findMentor(data.mentor_name);
        const checkStudentName=await findStudent(data.student_name);
        //checking if the given mentor and student is there in the database
        if(checkMentorName && checkStudentName){
            //checking if the student is already assigned to a mentor or not
            if(checkStudentName.status==="Assigned"){
                //finding the mentor for a student
                const checkStudentMentorName=await checkStudentMentor(checkStudentName.student_name);
                //storing the mentor in the database as a history
                const mentorDataDetails={...checkStudentMentorName[0]};
                const studentMentorHistory=await storingMentorDetails(mentorDataDetails);
                //removing a student from the mentor list
                const data={...checkStudentMentorName[0],status:"Not Assigned",students:"no students assigned"};
                const updatedData=await updatingMentor(data._id,data);

                //changing the mentor status to assigned
                const mentorStatusChange=await findMentorAndStatusUpdate(checkMentorName.mentor_name);
                //changing the student status to assigned
                const studentStatusChange=await findStudentAndStatusUpdate(checkStudentName.student_name);
                //finding again for updated data(status changed)
                const findMentor=await findingMentor(checkMentorName.mentor_name);
                const findStudent=await findingStudent(checkStudentName.student_name);
                //adding the student data to the mentor assigned
                const Updateddata={...findMentor,students:findStudent};
                const finalData=await addStudentsToMentor(Updateddata._id,Updateddata);

                res.status(200).json({mentor:Updateddata});
            }else{
                //changing the mentor status to assigned
                const mentorStatusChange=await findMentorAndStatusUpdate(checkMentorName.mentor_name);
                //changing the student status to assigned
                const studentStatusChange=await findStudentAndStatusUpdate(checkStudentName.student_name);
                //finding again for updated data(status changed)
                const findMentor=await findingMentor(checkMentorName.mentor_name);
                const findStudent=await findingStudent(checkStudentName.student_name);
                //adding the student data to the mentor assigned
                const Updateddata={...findMentor,students:findStudent};
                const finalData=await addStudentsToMentor(Updateddata._id,Updateddata);

                res.status(200).json({data:finalData});
            }    
        }else{
            res.status(500).json("mentor name or student name is invalid")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error,})
    }
})

//students for mentor
router.post("/mentorStudents",async(req,res)=>{
    try {
         //if there is no data entered it will show error
         if(Object.keys.length<=0){
            res.send(500).json({error:"Add details of the mentor to proceed"})
        }
        //finding mentor with mentor name
        const findMentorStudents=await findingMentorStudents(req.body.mentor_name);
        //if only there is a mentor in the database matches with the name it will process otherwise else block will send response
        if(findMentorStudents){
            //if status is not assigned it will have no students so is will send response as no students assigned
            if(findMentorStudents.status==="Not Assigned"){
                res.status(500).json("no students assigned")
            }else{
            //listing the students according to array or object
            const studentsList=findMentorStudents.students;
            if(typeof(studentsList.length)==="undefined"){
                res.status(200).json({students:studentsList.student_name});
            }else{
                const names=[];
                for(let i=0;i<studentsList.length;i++){
                     names.push(studentsList[i].student_name);
                }
                res.status(200).json({Students:names})
            }
            }
        }else{
            res.status(500).json("Invalid Mentor Name");
        }
       
    } catch (error) {
        console.log(error)
        res.status(500).json({error,})
    }
})

//All Data for Home
router.get("/",async(req,res)=>{
    try {
        //getting all data of mentor to show it in home page
        const getData=await getAllData();
        res.status(200).json({Data:getData});
    } catch (error) {
        console.log(error)
        res.status(500).json({error,})
    }
})

//Previously assigned Mentors for students
router.post("/history",async(req,res)=>{
    try {
         //if there is no data entered it will show error
         if(Object.keys.length<=0){
            res.send(500).json({error:"Add details of the student to proceed"})
        }
        //getting mentor details according to the student name
        const getMentorHistory=await getAllMentorData(req.body.student_name);
        //checking if the student name is valid
        const checkStudent=await findingStudent(req.body.student_name);
        if(checkStudent){
            //checking if there is a history of a student or not
            if(getMentorHistory.length===0){
                res.status(200).json("Student don't have a previous mentor")
            }else{
                res.status(200).json({history:getMentorHistory});
            }
            
        }else{
            res.status(200).json("Invalid Student Name")
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error,})
    }
})