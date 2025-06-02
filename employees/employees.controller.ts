import { Router, Request, Response } from 'express';
import { EmployeeService } from './employee.service';

const router = Router();
const employeeService = new EmployeeService();

// Use Case 1: Add a New Employee
router.post('/', async (req: Request, res: Response) => {
  try {
    const newEmployee = await employeeService.create(req.body);
    res.status(201).json(newEmployee);
} catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
});

//Use Case 2: Retrieve All Employees
router.get('/', async (req: Request, res: Response) => {
    try {
      const employees = await employeeService.getAll();
      res.status(200).json(employees);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

//Use Case 3: Update Employee Salary
  router.put("/:id/salary", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { salary } = req.body;
  
      if (salary === undefined) {
        res.status(400).json({ message:  "Salary is required" });
        return;
      }

      const updatedEmployee = await employeeService.updateSalary(id, salary);
      res.status(200).json({
        message: "Updated Employee Salary",
        employee_details: {
          id: updatedEmployee.id,
          name: updatedEmployee.name,
          position: updatedEmployee.position,
          updated_salary: updatedEmployee.salary,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "An unknown error occurred" });
      }
    }
  });
  

  //Use Case 4: Delete an Employee
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedEmployee = await employeeService.softDelete(id);
      res.status(200).json({
        message: "Employee deleted",
        employee_details: {
          id: updatedEmployee.id,
          name: updatedEmployee.name,
          position: updatedEmployee.position,
          isActive: updatedEmployee.isActive,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "An unknown error occurred" });
      }
    }
  });


  // Use Case 5: Search Employees by Name
  router.get("/search", async (req: Request, res: Response) => {
    try {
      const { name } = req.query;
      if (!name || typeof name !== 'string') {
        res.status(400).json({ message: "Name query parameter is required" });
        return; // return undefined (void)
      }
      const employees = await employeeService.searchByName(name);
      res.status(200).json(employees);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });
  

// PUT Request: Update Employee details
// API Route: PUT /employees/:id/update
router.put("/:id/update", async (req: Request, res: Response) => {
  try {
    const employeeId = parseInt(req.params.id, 10);
    const updatedData = req.body;

    const updatedEmployee = await employeeService.updateEmployee(employeeId, updatedData);

    res.status(200).json({
      message: "Employee updated successfully",
      employee: {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        position: updatedEmployee.position,
        salary: updatedEmployee.salary,
        department: updatedEmployee.department.name,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});


export default router;
