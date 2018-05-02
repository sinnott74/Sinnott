import {
  BaseModel,
  Entity,
  Column,
  ManyToMany,
  ModelManager,
  metadata
} from "../dist/orm";
import Teacher from "./testclasses/Teacher";
import Student from "./testclasses/Student";

beforeAll(async () => {
  metadata.build();
  if (ModelManager.getModel("TeacherStudent")) {
    await ModelManager.getModel("TeacherStudent").drop();
  }
  await Student.drop();
  await Teacher.drop();
  await Student.sync();
  await Teacher.sync();
  await ModelManager.getModel("TeacherStudent").sync();
});

describe("Many To Many", () => {
  it("allows a student to have many teachers", async () => {
    const student = new Student({ name: "Student1" });

    const teacher1 = new Teacher({ subject: "maths" });
    const teacher2 = new Teacher({ subject: "compsci" });

    student.teachers = [teacher1, teacher2];
    await student.save();

    const foundStudent = await Student.get<Student>(student.id);

    expect(foundStudent.toJSON()).toEqual(student.toJSON());
    expect(foundStudent.teachers).toContainEqual(teacher1);
    expect(foundStudent.teachers).toContainEqual(teacher2);
  });

  it("allows a teacher to have many students", async () => {
    const student1 = new Student({ name: "Student1" });
    const student2 = new Student({ name: "Student2" });

    const teacher = new Teacher({ subject: "maths" });

    teacher.students = [student1, student2];
    await teacher.save();

    const foundTeacher = await Teacher.get<Teacher>(teacher.id);

    expect(foundTeacher.toJSON()).toEqual(teacher.toJSON());
    expect(foundTeacher.students).toContainEqual(student1);
    expect(foundTeacher.students).toContainEqual(student2);
  });
});

// yarn build && ../node_modules/jest/bin/jest.js manytomany.e2e.ts