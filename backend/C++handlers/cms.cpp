#include <iostream>
#include <string>
#include <nlohmann/json.hpp> // Include JSON library

using json = nlohmann::json;

// Base class: User

class User {
protected:
    std::string firstName;
    std::string middleName;
    std::string lastName;
    std::string email;
    std::string phoneNumber;
    std::string gender;
    std::string profile;

public:
    User(const std::string& firstName, const std::string& middleName, const std::string& lastName,
         const std::string& email, const std::string& phoneNumber, const std::string& gender,
         const std::string& profile)
        : firstName(firstName), middleName(middleName), lastName(lastName), email(email),
          phoneNumber(phoneNumber), gender(gender), profile(profile) {}

    virtual json toJSON() const {
        return json{
            {"firstName", firstName},
            {"middleName", middleName},
            {"lastName", lastName},
            {"email", email},
            {"phoneNumber", phoneNumber},
            {"gender", gender},
            {"profile", profile}};
    }

    virtual void printInfo() const {
        std::cerr << "User Information:\n"
                  << "  Name: " << firstName << " " << middleName << " " << lastName << "\n"
                  << "  Email: " << email << "\n"
                  << "  Phone: " << phoneNumber << "\n"
                  << "  Gender: " << gender << "\n"
                  << "  Profile: " << profile << "\n";
    }

    virtual ~User() = default;
};

// Derived class: Student
class Student : public User {
private:
    int enrollmentNo;
    int semester;
    std::string branch;

public:
    Student(const std::string& firstName, const std::string& middleName, const std::string& lastName,
            const std::string& email, const std::string& phoneNumber, const std::string& gender,
            const std::string& profile, int enrollmentNo, int semester, const std::string& branch)
        : User(firstName, middleName, lastName, email, phoneNumber, gender, profile),
          enrollmentNo(enrollmentNo), semester(semester), branch(branch) {}

    json toJSON() const override {
        auto base = User::toJSON();
        base["role"] = "Student";
        base["enrollmentNo"] = enrollmentNo;
        base["semester"] = semester;
        base["branch"] = branch;
        return base;
    }

    void printInfo() const override {
        User::printInfo();
        std::cerr << "  Role: Student\n"
                  << "  Enrollment No: " << enrollmentNo << "\n"
                  << "  Semester: " << semester << "\n"
                  << "  Branch: " << branch << "\n";
    }
};

// Derived class: Faculty
class Faculty : public User {
private:
    int employeeId;
    std::string department;
    int experience;
    std::string post;

public:
    Faculty(const std::string& firstName, const std::string& middleName, const std::string& lastName,
            const std::string& email, const std::string& phoneNumber, const std::string& gender,
            const std::string& profile, int employeeId, const std::string& department, int experience,
            const std::string& post)
        : User(firstName, middleName, lastName, email, phoneNumber, gender, profile),
          employeeId(employeeId), department(department), experience(experience), post(post) {}

    json toJSON() const override {
        auto base = User::toJSON();
        base["role"] = "Faculty";
        base["employeeId"] = employeeId;
        base["department"] = department;
        base["experience"] = experience;
        base["post"] = post;
        return base;
    }

    void printInfo() const override {
        User::printInfo();
        std::cerr << "  Role: Faculty\n"
                  << "  Employee ID: " << employeeId << "\n"
                  << "  Department: " << department << "\n"
                  << "  Experience: " << experience << " years\n"
                  << "  Post: " << post << "\n";
    }
};

// Derived class: Admin
class Admin : public User {
private:
    int employeeId;

public:
    Admin(const std::string& firstName, const std::string& middleName, const std::string& lastName,
          const std::string& email, const std::string& phoneNumber, const std::string& gender,
          const std::string& profile, int employeeId)
        : User(firstName, middleName, lastName, email, phoneNumber, gender, profile),
          employeeId(employeeId) {}

    json toJSON() const override {
        auto base = User::toJSON();
        base["role"] = "Admin";
        base["employeeId"] = employeeId;
        return base;
    }

    void printInfo() const override {
        User::printInfo();
        std::cerr << "  Role: Admin\n"
                  << "  Employee ID: " << employeeId << "\n";
    }
};


int main(int argc, char* argv[]) {
    if (argc < 9) {
        std::cerr << "Usage: ./college_management <role> <firstName> <middleName> <lastName> <email> <phoneNumber> <gender> <profile> [additional args...]\n";
        return 1;
    }

    std::string role = argv[1];
    std::string firstName = argv[2];
    std::string middleName = argv[3];
    std::string lastName = argv[4];
    std::string email = argv[5];
    std::string phoneNumber = argv[6];
    std::string gender = argv[7];
    std::string profile = argv[8];

    json result;

    try {
        if (role == "Student" && argc == 12) {
            int enrollmentNo = std::stoi(argv[9]);
            int semester = std::stoi(argv[10]);
            std::string branch = argv[11];
            Student student(firstName, middleName, lastName, email, phoneNumber, gender, profile, enrollmentNo, semester, branch);
            student.printInfo();
            result = student.toJSON();
        } else if (role == "Faculty" && argc == 13) {
            int employeeId = std::stoi(argv[9]);
            std::string department = argv[10];
            int experience = std::stoi(argv[11]);
            std::string post = argv[12];
            Faculty faculty(firstName, middleName, lastName, email, phoneNumber, gender, profile, employeeId, department, experience, post);
            faculty.printInfo();
            result = faculty.toJSON();
        } else if (role == "Admin" && argc == 10) {
            int employeeId = std::stoi(argv[9]);
            Admin admin(firstName, middleName, lastName, email, phoneNumber, gender, profile, employeeId);
            admin.printInfo();
            result = admin.toJSON();
        } else {
            throw std::invalid_argument("Invalid role or arguments.");
        }

        std::cout << result.dump() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "{\"error\": \"" << e.what() << "\"}" << std::endl;
        return 1;
    }

    return 0;
}
