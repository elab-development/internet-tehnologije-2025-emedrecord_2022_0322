import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "eMedRecord API",
    description:
      "REST API for the eMedRecord medical records and appointment management system. All endpoints require authentication via Clerk session.",
    version: "1.0.0",
    contact: {
      name: "eMedRecord Team",
    },
  },
  servers: [
    {
      url: "{protocol}://{host}",
      variables: {
        protocol: { default: "http", enum: ["http", "https"] },
        host: { default: "localhost:3000" },
      },
    },
  ],
  tags: [
    { name: "Patients", description: "Patient management" },
    { name: "Doctors", description: "Doctor management" },
    { name: "Appointments", description: "Appointment scheduling and management" },
    { name: "Staff", description: "Staff (nurses) management" },
    { name: "Payments", description: "Payment and billing" },
    { name: "Services", description: "Medical services catalog" },
    { name: "Medical Records", description: "Patient medical records" },
  ],
  paths: {
    "/api/patients": {
      get: {
        tags: ["Patients"],
        summary: "List patients",
        description: "Returns a paginated list of patients with optional search filtering.",
        parameters: [
          { $ref: "#/components/parameters/page" },
          { $ref: "#/components/parameters/limit" },
          { $ref: "#/components/parameters/search" },
        ],
        responses: {
          "200": {
            description: "Paginated list of patients",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/PatientSummary" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/patients/{id}": {
      get: {
        tags: ["Patients"],
        summary: "Get patient by ID",
        description: "Returns full details of a single patient.",
        parameters: [{ $ref: "#/components/parameters/resourceId" }],
        responses: {
          "200": {
            description: "Patient details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                    status: { type: "integer", example: 200 },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/doctors": {
      get: {
        tags: ["Doctors"],
        summary: "List doctors",
        description: "Returns a paginated list of doctors with optional search filtering.",
        parameters: [
          { $ref: "#/components/parameters/page" },
          { $ref: "#/components/parameters/limit" },
          { $ref: "#/components/parameters/search" },
        ],
        responses: {
          "200": {
            description: "Paginated list of doctors",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Doctor" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/doctors/{id}": {
      get: {
        tags: ["Doctors"],
        summary: "Get doctor by ID",
        description: "Returns full details of a single doctor including working days and recent appointments.",
        parameters: [{ $ref: "#/components/parameters/resourceId" }],
        responses: {
          "200": {
            description: "Doctor details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Doctor" },
                    totalAppointment: { type: "integer" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { description: "Doctor not found" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/appointments": {
      get: {
        tags: ["Appointments"],
        summary: "List appointments",
        description: "Returns a paginated list of appointments. Can be filtered by patient_id or doctor_id.",
        parameters: [
          { $ref: "#/components/parameters/page" },
          { $ref: "#/components/parameters/limit" },
          { $ref: "#/components/parameters/search" },
          {
            name: "patient_id",
            in: "query",
            schema: { type: "string" },
            description: "Filter by patient ID",
          },
          {
            name: "doctor_id",
            in: "query",
            schema: { type: "string" },
            description: "Filter by doctor ID",
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of appointments",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/AppointmentSummary" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Appointments"],
        summary: "Create appointment",
        description: "Books a new appointment for a patient with a doctor.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAppointment" },
            },
          },
        },
        responses: {
          "201": {
            description: "Appointment created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Appointment created successfully" },
                    data: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/appointments/{id}": {
      get: {
        tags: ["Appointments"],
        summary: "Get appointment by ID",
        description: "Returns details of a single appointment including patient and doctor info.",
        parameters: [{ $ref: "#/components/parameters/resourceId" }],
        responses: {
          "200": {
            description: "Appointment details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Appointment" },
                    status: { type: "integer", example: 200 },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      patch: {
        tags: ["Appointments"],
        summary: "Update appointment status",
        description: "Updates the status of an appointment (e.g. schedule, cancel, complete).",
        parameters: [{ $ref: "#/components/parameters/resourceId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAppointmentStatus" },
            },
          },
        },
        responses: {
          "200": {
            description: "Appointment status updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid status value" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { description: "Appointment not found" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/staff": {
      get: {
        tags: ["Staff"],
        summary: "List staff",
        description: "Returns a paginated list of staff members (nurses).",
        parameters: [
          { $ref: "#/components/parameters/page" },
          { $ref: "#/components/parameters/limit" },
          { $ref: "#/components/parameters/search" },
        ],
        responses: {
          "200": {
            description: "Paginated list of staff",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Staff" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/payments": {
      get: {
        tags: ["Payments"],
        summary: "List payments",
        description: "Returns a paginated list of payment records.",
        parameters: [
          { $ref: "#/components/parameters/page" },
          { $ref: "#/components/parameters/limit" },
          { $ref: "#/components/parameters/search" },
        ],
        responses: {
          "200": {
            description: "Paginated list of payments",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Payment" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "List services",
        description: "Returns all available medical services.",
        responses: {
          "200": {
            description: "List of services",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Service" },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Services"],
        summary: "Create service",
        description: "Adds a new medical service. Requires admin role.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateService" },
            },
          },
        },
        responses: {
          "201": {
            description: "Service created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Service" },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { description: "Forbidden — admin role required" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/medical-records": {
      get: {
        tags: ["Medical Records"],
        summary: "List medical records",
        description: "Returns a paginated list of medical records with patient and diagnosis information.",
        parameters: [
          { $ref: "#/components/parameters/page" },
          { $ref: "#/components/parameters/limit" },
          { $ref: "#/components/parameters/search" },
        ],
        responses: {
          "200": {
            description: "Paginated list of medical records",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/MedicalRecord" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
  components: {
    parameters: {
      page: {
        name: "page",
        in: "query",
        schema: { type: "integer", default: 1, minimum: 1 },
        description: "Page number",
      },
      limit: {
        name: "limit",
        in: "query",
        schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
        description: "Items per page",
      },
      search: {
        name: "search",
        in: "query",
        schema: { type: "string" },
        description: "Search term (filters by name, email, etc.)",
      },
      resourceId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "Resource identifier",
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication required",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Unauthorized" },
              },
            },
          },
        },
      },
      InternalError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Internal Server Error" },
              },
            },
          },
        },
      },
    },
    schemas: {
      PaginatedResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          totalRecords: { type: "integer" },
          totalPages: { type: "integer" },
          currentPage: { type: "integer" },
        },
      },
      PatientSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          first_name: { type: "string", example: "Marko" },
          last_name: { type: "string", example: "Petrović" },
          email: { type: "string", format: "email" },
          phone: { type: "string", example: "0611234567" },
          gender: { type: "string", enum: ["MALE", "FEMALE"] },
          date_of_birth: { type: "string", format: "date-time" },
          blood_group: { type: "string", nullable: true },
          img: { type: "string", nullable: true },
          colorCode: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Patient: {
        type: "object",
        properties: {
          id: { type: "string" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          date_of_birth: { type: "string", format: "date-time" },
          gender: { type: "string", enum: ["MALE", "FEMALE"] },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          marital_status: { type: "string" },
          address: { type: "string" },
          emergency_contact_name: { type: "string" },
          emergency_contact_number: { type: "string" },
          relation: { type: "string" },
          blood_group: { type: "string", nullable: true },
          allergies: { type: "string", nullable: true },
          medical_conditions: { type: "string", nullable: true },
          medical_history: { type: "string", nullable: true },
          insurance_provider: { type: "string", nullable: true },
          insurance_number: { type: "string", nullable: true },
          img: { type: "string", nullable: true },
          colorCode: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Doctor: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", example: "Dr. Ana Jovanović" },
          email: { type: "string", format: "email" },
          specialization: { type: "string", example: "Cardiology" },
          license_number: { type: "string" },
          phone: { type: "string" },
          address: { type: "string" },
          department: { type: "string", nullable: true },
          type: { type: "string", enum: ["FULL", "PART"] },
          img: { type: "string", nullable: true },
          colorCode: { type: "string", nullable: true },
          working_days: {
            type: "array",
            items: { $ref: "#/components/schemas/WorkingDay" },
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      WorkingDay: {
        type: "object",
        properties: {
          id: { type: "integer" },
          day: { type: "string", example: "monday" },
          start_time: { type: "string", example: "08:00" },
          close_time: { type: "string", example: "16:00" },
        },
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patient_id: { type: "string" },
          doctor_id: { type: "string" },
          appointment_date: { type: "string", format: "date-time" },
          time: { type: "string", example: "10:00 AM" },
          status: {
            type: "string",
            enum: ["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"],
          },
          type: { type: "string", example: "General Checkup" },
          note: { type: "string", nullable: true },
          reason: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      AppointmentSummary: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patient_id: { type: "string" },
          doctor_id: { type: "string" },
          appointment_date: { type: "string", format: "date-time" },
          time: { type: "string" },
          status: {
            type: "string",
            enum: ["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"],
          },
          type: { type: "string" },
          patient: { $ref: "#/components/schemas/PatientSummary" },
          doctor: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              specialization: { type: "string" },
              img: { type: "string", nullable: true },
              colorCode: { type: "string", nullable: true },
            },
          },
        },
      },
      CreateAppointment: {
        type: "object",
        required: ["patient_id", "doctor_id", "type", "appointment_date", "time"],
        properties: {
          patient_id: { type: "string", description: "Patient Clerk user ID" },
          doctor_id: { type: "string", description: "Doctor Clerk user ID" },
          type: { type: "string", example: "General Checkup" },
          appointment_date: { type: "string", format: "date", example: "2026-03-15" },
          time: { type: "string", example: "10:00 AM" },
          note: { type: "string", nullable: true },
        },
      },
      UpdateAppointmentStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"],
          },
          reason: { type: "string", nullable: true, description: "Reason for status change (e.g. cancellation reason)" },
        },
      },
      Staff: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          address: { type: "string" },
          department: { type: "string", nullable: true },
          role: { type: "string", enum: ["ADMIN", "NURSE", "DOCTOR", "PATIENT"] },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "DORMANT"] },
          license_number: { type: "string", nullable: true },
          img: { type: "string", nullable: true },
          colorCode: { type: "string", nullable: true },
          doctor_id: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patient_id: { type: "string" },
          appointment_id: { type: "integer" },
          bill_date: { type: "string", format: "date-time" },
          payment_date: { type: "string", format: "date-time" },
          discount: { type: "number", format: "float" },
          total_amount: { type: "number", format: "float" },
          amount_paid: { type: "number", format: "float" },
          payment_method: { type: "string", enum: ["CASH", "CARD"] },
          status: { type: "string", enum: ["PAID", "UNPAID", "PART"] },
          receipt_number: { type: "integer" },
          patient: { $ref: "#/components/schemas/PatientSummary" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Service: {
        type: "object",
        properties: {
          id: { type: "integer" },
          service_name: { type: "string", example: "Blood Test" },
          description: { type: "string" },
          price: { type: "number", format: "float", example: 2500 },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      CreateService: {
        type: "object",
        required: ["service_name", "price", "description"],
        properties: {
          service_name: { type: "string", example: "Blood Test" },
          price: { type: "string", example: "2500" },
          description: { type: "string", example: "Complete blood count analysis" },
        },
      },
      MedicalRecord: {
        type: "object",
        properties: {
          id: { type: "integer" },
          patient_id: { type: "string" },
          appointment_id: { type: "integer" },
          doctor_id: { type: "string" },
          treatment_plan: { type: "string", nullable: true },
          prescriptions: { type: "string", nullable: true },
          lab_request: { type: "string", nullable: true },
          notes: { type: "string", nullable: true },
          patient: { $ref: "#/components/schemas/PatientSummary" },
          diagnosis: {
            type: "array",
            items: { $ref: "#/components/schemas/Diagnosis" },
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Diagnosis: {
        type: "object",
        properties: {
          id: { type: "integer" },
          symptoms: { type: "string" },
          diagnosis: { type: "string" },
          notes: { type: "string", nullable: true },
          prescribed_medications: { type: "string", nullable: true },
          follow_up_plan: { type: "string", nullable: true },
          doctor: {
            type: "object",
            properties: {
              name: { type: "string" },
              specialization: { type: "string" },
              img: { type: "string", nullable: true },
              colorCode: { type: "string", nullable: true },
            },
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
    },
    securitySchemes: {
      clerkSession: {
        type: "apiKey",
        in: "cookie",
        name: "__session",
        description: "Clerk session cookie — log in via the application UI to obtain a valid session.",
      },
    },
  },
  security: [{ clerkSession: [] }],
};

export function GET() {
  return NextResponse.json(openApiSpec, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
