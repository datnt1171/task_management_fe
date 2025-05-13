// Mock departments and roles
export const mockDepartments = [
  { id: 1, name: "Operations" },
  { id: 2, name: "Maintenance" },
  { id: 3, name: "Finance" },
]

export const mockRoles = [
  { id: 1, name: "Manager" },
  { id: 2, name: "Technician" },
  { id: 3, name: "Approver" },
]

// Mock user data
export const mockUser = {
  id: 1,
  username: "demo_user",
  first_name: "Demo",
  last_name: "User",
  department: mockDepartments[0],
  role: mockRoles[0],
}

// Mock users for assignments
export const mockUsers = [
  mockUser,
  {
    id: 2,
    username: "john_doe",
    first_name: "John",
    last_name: "Doe",
    department: mockDepartments[1],
    role: mockRoles[1],
  },
  {
    id: 3,
    username: "jane_smith",
    first_name: "Jane",
    last_name: "Smith",
    department: mockDepartments[2],
    role: mockRoles[2],
  },
]

// Mock state types and states
export const mockStateTypes = [
  { id: 1, name: "Initial" },
  { id: 2, name: "Intermediate" },
  { id: 3, name: "Terminal" },
]

export const mockStates = [
  { id: 1, name: "pending", description: "Waiting for action", state_type: mockStateTypes[0] },
  { id: 2, name: "approved", description: "Request approved", state_type: mockStateTypes[1] },
  { id: 3, name: "rejected", description: "Request rejected", state_type: mockStateTypes[2] },
  { id: 4, name: "completed", description: "Task completed", state_type: mockStateTypes[2] },
  { id: 5, name: "working-on", description: "In progress", state_type: mockStateTypes[1] },
]

// Mock action types and actions
export const mockActionTypes = [
  { id: 1, name: "Approval" },
  { id: 2, name: "Rejection" },
  { id: 3, name: "Processing" },
]

// Mock field types
export const mockFieldTypes = {
  TEXT: "text",
  NUMBER: "number",
  DATE: "date",
  SELECT: "select",
  CHECKBOX: "checkbox",
  FILE: "file",
  JSON: "json",
}

// Mock processes with fields and actions
export const mockProcesses = {
  count: 3,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      name: "Maintenance Request",
      description: "Request for maintenance services",
      allowed_users: [
        { id: 1, user: mockUsers[1] }, // John Doe
        { id: 2, user: mockUsers[2] }, // Jane Smith
      ],
      fields: [
        {
          id: 1,
          name: "Property ID",
          field_type: mockFieldTypes.TEXT,
          required: true,
          options: null,
        },
        {
          id: 2,
          name: "Task Detail",
          field_type: mockFieldTypes.TEXT,
          required: true,
          options: null,
        },
        {
          id: 3,
          name: "Required Completion Date",
          field_type: mockFieldTypes.DATE,
          required: true,
          options: null,
        },
        {
          id: 4,
          name: "Priority",
          field_type: mockFieldTypes.SELECT,
          required: true,
          options: ["Low", "Medium", "High", "Critical"],
        },
      ],
      actions: [
        {
          id: 1,
          name: "approve",
          description: "Approve the request",
          action_type: mockActionTypes[0],
        },
        {
          id: 2,
          name: "reject",
          description: "Reject the request",
          action_type: mockActionTypes[1],
        },
        {
          id: 3,
          name: "complete",
          description: "Mark as completed",
          action_type: mockActionTypes[2],
        },
      ],
    },
    {
      id: 2,
      name: "Common Task",
      description: "General task assignment",
      allowed_users: [
        { id: 3, user: mockUsers[1] }, // John Doe
      ],
      fields: [
        {
          id: 5,
          name: "Task Description",
          field_type: mockFieldTypes.TEXT,
          required: true,
          options: null,
        },
        {
          id: 6,
          name: "Due Date",
          field_type: mockFieldTypes.DATE,
          required: true,
          options: null,
        },
        {
          id: 7,
          name: "Task Type",
          field_type: mockFieldTypes.SELECT,
          required: true,
          options: ["Documentation", "Development", "Testing", "Review"],
        },
      ],
      actions: [
        {
          id: 4,
          name: "approve",
          description: "Approve the task",
          action_type: mockActionTypes[0],
        },
        {
          id: 5,
          name: "reject",
          description: "Reject the task",
          action_type: mockActionTypes[1],
        },
      ],
    },
    {
      id: 3,
      name: "Purchase Request",
      description: "Request for purchasing items or services",
      allowed_users: [
        { id: 4, user: mockUsers[2] }, // Jane Smith
      ],
      fields: [
        {
          id: 8,
          name: "Item Description",
          field_type: mockFieldTypes.TEXT,
          required: true,
          options: null,
        },
        {
          id: 9,
          name: "Quantity",
          field_type: mockFieldTypes.NUMBER,
          required: true,
          options: null,
        },
        {
          id: 10,
          name: "Estimated Cost",
          field_type: mockFieldTypes.NUMBER,
          required: true,
          options: null,
        },
        {
          id: 11,
          name: "Required By Date",
          field_type: mockFieldTypes.DATE,
          required: true,
          options: null,
        },
        {
          id: 12,
          name: "Budget Code",
          field_type: mockFieldTypes.TEXT,
          required: true,
          options: null,
        },
      ],
      actions: [
        {
          id: 6,
          name: "approve",
          description: "Approve the purchase",
          action_type: mockActionTypes[0],
        },
        {
          id: 7,
          name: "reject",
          description: "Reject the purchase",
          action_type: mockActionTypes[1],
        },
      ],
    },
  ],
}

// Mock transitions
export const mockTransitions = [
  {
    id: 1,
    process: mockProcesses.results[0],
    current_state: mockStates[0], // pending
    next_state: mockStates[1], // approved
  },
  {
    id: 2,
    process: mockProcesses.results[0],
    current_state: mockStates[0], // pending
    next_state: mockStates[2], // rejected
  },
  {
    id: 3,
    process: mockProcesses.results[0],
    current_state: mockStates[1], // approved
    next_state: mockStates[4], // working-on
  },
  {
    id: 4,
    process: mockProcesses.results[0],
    current_state: mockStates[4], // working-on
    next_state: mockStates[3], // completed
  },
]

// Mock action transitions
export const mockActionTransitions = [
  {
    id: 1,
    action: mockProcesses.results[0].actions[0], // approve
    transition: mockTransitions[0], // pending -> approved
  },
  {
    id: 2,
    action: mockProcesses.results[0].actions[1], // reject
    transition: mockTransitions[1], // pending -> rejected
  },
  {
    id: 3,
    action: mockProcesses.results[0].actions[2], // complete
    transition: mockTransitions[3], // working-on -> completed
  },
]

// Mock tasks
export const mockTasks = {
  // Sent tasks
  sent: {
    count: 4,
    next: null,
    previous: null,
    results: [
      {
        id: 1,
        title: "BT001",
        process: mockProcesses.results[0], // Maintenance Request
        state: mockStates[0], // pending
        created_at: "2023-05-08T10:30:00Z",
        created_by: mockUser,
        stakeholders: [
          { id: 1, user: mockUsers[1] }, // John Doe
        ],
        task_data: [
          {
            id: 1,
            field: mockProcesses.results[0].fields[0], // Property ID
            value: "Property-123",
          },
          {
            id: 2,
            field: mockProcesses.results[0].fields[1], // Task Detail
            value: "Bathroom faucet is leaking and needs repair",
          },
          {
            id: 3,
            field: mockProcesses.results[0].fields[2], // Required Completion Date
            value: "2023-05-20",
          },
          {
            id: 4,
            field: mockProcesses.results[0].fields[3], // Priority
            value: "Medium",
          },
        ],
        action_logs: [
          {
            id: 1,
            user: mockUser,
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-08T10:30:00Z",
          },
        ],
      },
      {
        id: 2,
        title: "BT002",
        process: mockProcesses.results[0], // Maintenance Request
        state: mockStates[4], // working-on
        created_at: "2023-05-07T14:15:00Z",
        created_by: mockUser,
        stakeholders: [
          { id: 2, user: mockUsers[1] }, // John Doe
        ],
        task_data: [
          {
            id: 5,
            field: mockProcesses.results[0].fields[0], // Property ID
            value: "Property-456",
          },
          {
            id: 6,
            field: mockProcesses.results[0].fields[1], // Task Detail
            value: "Air conditioning unit not cooling properly",
          },
          {
            id: 7,
            field: mockProcesses.results[0].fields[2], // Required Completion Date
            value: "2023-05-15",
          },
          {
            id: 8,
            field: mockProcesses.results[0].fields[3], // Priority
            value: "High",
          },
        ],
        action_logs: [
          {
            id: 2,
            user: mockUser,
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-07T14:15:00Z",
          },
          {
            id: 3,
            user: mockUsers[1],
            action: mockProcesses.results[0].actions[0], // approve
            timestamp: "2023-05-07T16:30:00Z",
          },
        ],
      },
      {
        id: 3,
        title: "BT003",
        process: mockProcesses.results[1], // Common Task
        state: mockStates[3], // completed
        created_at: "2023-05-05T09:45:00Z",
        created_by: mockUser,
        stakeholders: [
          { id: 3, user: mockUsers[2] }, // Jane Smith
        ],
        task_data: [
          {
            id: 9,
            field: mockProcesses.results[1].fields[0], // Task Description
            value: "Update the documentation for the new feature",
          },
          {
            id: 10,
            field: mockProcesses.results[1].fields[1], // Due Date
            value: "2023-05-10",
          },
          {
            id: 11,
            field: mockProcesses.results[1].fields[2], // Task Type
            value: "Documentation",
          },
        ],
        action_logs: [
          {
            id: 4,
            user: mockUser,
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-05T09:45:00Z",
          },
          {
            id: 5,
            user: mockUsers[2],
            action: mockProcesses.results[1].actions[0], // approve
            timestamp: "2023-05-05T11:20:00Z",
          },
          {
            id: 6,
            user: mockUsers[2],
            action: {
              id: 9,
              name: "complete",
              description: "Complete task",
              action_type: { id: 3, name: "Processing" },
            },
            timestamp: "2023-05-09T14:30:00Z",
          },
        ],
      },
      {
        id: 4,
        title: "BT004",
        process: mockProcesses.results[2], // Purchase Request
        state: mockStates[0], // pending
        created_at: "2023-05-04T16:20:00Z",
        created_by: mockUser,
        stakeholders: [
          { id: 4, user: mockUsers[2] }, // Jane Smith
        ],
        task_data: [
          {
            id: 12,
            field: mockProcesses.results[2].fields[0], // Item Description
            value: "Office supplies for the new team members",
          },
          {
            id: 13,
            field: mockProcesses.results[2].fields[1], // Quantity
            value: "10",
          },
          {
            id: 14,
            field: mockProcesses.results[2].fields[2], // Estimated Cost
            value: "500",
          },
          {
            id: 15,
            field: mockProcesses.results[2].fields[3], // Required By Date
            value: "2023-05-25",
          },
          {
            id: 16,
            field: mockProcesses.results[2].fields[4], // Budget Code
            value: "BUD-2023-001",
          },
        ],
        action_logs: [
          {
            id: 7,
            user: mockUser,
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-04T16:20:00Z",
          },
        ],
      },
    ],
  },

  // Received tasks
  received: {
    count: 3,
    next: null,
    previous: null,
    results: [
      {
        id: 5,
        title: "BT005",
        process: mockProcesses.results[0], // Maintenance Request
        state: mockStates[0], // pending
        created_at: "2023-05-09T11:30:00Z",
        created_by: mockUsers[1], // John Doe
        stakeholders: [
          { id: 5, user: mockUser }, // Demo User
        ],
        task_data: [
          {
            id: 17,
            field: mockProcesses.results[0].fields[0], // Property ID
            value: "Property-789",
          },
          {
            id: 18,
            field: mockProcesses.results[0].fields[1], // Task Detail
            value: "Kitchen sink is clogged and needs to be fixed",
          },
          {
            id: 19,
            field: mockProcesses.results[0].fields[2], // Required Completion Date
            value: "2023-05-18",
          },
          {
            id: 20,
            field: mockProcesses.results[0].fields[3], // Priority
            value: "Medium",
          },
        ],
        action_logs: [
          {
            id: 8,
            user: mockUsers[1],
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-09T11:30:00Z",
          },
        ],
        available_actions: [
          mockProcesses.results[0].actions[0], // approve
          mockProcesses.results[0].actions[1], // reject
        ],
      },
      {
        id: 6,
        title: "BT006",
        process: mockProcesses.results[1], // Common Task
        state: mockStates[0], // pending
        created_at: "2023-05-08T09:45:00Z",
        created_by: mockUsers[2], // Jane Smith
        stakeholders: [
          { id: 6, user: mockUser }, // Demo User
        ],
        task_data: [
          {
            id: 21,
            field: mockProcesses.results[1].fields[0], // Task Description
            value: "Review the quarterly report and provide feedback",
          },
          {
            id: 22,
            field: mockProcesses.results[1].fields[1], // Due Date
            value: "2023-05-17",
          },
          {
            id: 23,
            field: mockProcesses.results[1].fields[2], // Task Type
            value: "Review",
          },
        ],
        action_logs: [
          {
            id: 9,
            user: mockUsers[2],
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-08T09:45:00Z",
          },
        ],
        available_actions: [
          mockProcesses.results[1].actions[0], // approve
          mockProcesses.results[1].actions[1], // reject
        ],
      },
      {
        id: 7,
        title: "BT007",
        process: mockProcesses.results[2], // Purchase Request
        state: mockStates[4], // working-on
        created_at: "2023-05-07T13:15:00Z",
        created_by: mockUsers[1], // John Doe
        stakeholders: [
          { id: 7, user: mockUser }, // Demo User
        ],
        task_data: [
          {
            id: 24,
            field: mockProcesses.results[2].fields[0], // Item Description
            value: "New laptop for the development team",
          },
          {
            id: 25,
            field: mockProcesses.results[2].fields[1], // Quantity
            value: "3",
          },
          {
            id: 26,
            field: mockProcesses.results[2].fields[2], // Estimated Cost
            value: "4500",
          },
          {
            id: 27,
            field: mockProcesses.results[2].fields[3], // Required By Date
            value: "2023-05-30",
          },
          {
            id: 28,
            field: mockProcesses.results[2].fields[4], // Budget Code
            value: "BUD-2023-002",
          },
        ],
        action_logs: [
          {
            id: 10,
            user: mockUsers[1],
            action: { id: 8, name: "create", description: "Create task", action_type: { id: 4, name: "Creation" } },
            timestamp: "2023-05-07T13:15:00Z",
          },
          {
            id: 11,
            user: mockUser,
            action: mockProcesses.results[2].actions[0], // approve
            timestamp: "2023-05-07T15:45:00Z",
          },
        ],
        available_actions: [
          { id: 9, name: "complete", description: "Complete task", action_type: { id: 3, name: "Processing" } },
        ],
      },
    ],
  },
}

// Helper function to get task by ID
export function getTaskById(id: number) {
  type Task = {
    id: number;
    title: string;
    process: any;
    state: any;
    created_at: string;
    created_by: any;
    stakeholders: any[];
    task_data: any[];
    action_logs: any[];
    available_actions?: any[];
  };

  // Check sent tasks
  const sentTask = mockTasks.sent.results.find((task) => task.id === id) as Task;
  if (sentTask) return sentTask;

  // Check received tasks
  const receivedTask = mockTasks.received.results.find((task) => task.id === id) as Task;
  if (receivedTask) return receivedTask;

  return null;
}

// Helper function to get process by ID
export function getProcessById(id: number) {
  return mockProcesses.results.find((process) => process.id === id) || null
}

// Helper function to get available transitions for a task
export function getAvailableTransitions(task: any) {
  if (!task) return []

  return mockTransitions.filter(
    (transition) => transition.process.id === task.process.id && transition.current_state.id === task.state.id,
  )
}

// Helper function to get available actions for a task
export function getAvailableActions(task: any) {
  if (!task) return []

  const transitions = getAvailableTransitions(task)
  const actionIds = new Set()
  const actions = []

  for (const transition of transitions) {
    const actionTransitions = mockActionTransitions.filter((at) => at.transition.id === transition.id)

    for (const at of actionTransitions) {
      if (!actionIds.has(at.action.id)) {
        actionIds.add(at.action.id)
        actions.push({
          ...at.action,
          transition: transition,
        })
      }
    }
  }

  return actions
}

// Helper function to perform an action on a task
export function performAction(taskId: number, actionId: number) {
  const task = getTaskById(taskId)
  if (!task) return null

  const action = task.process.actions.find((a: any) => a.id === actionId)
  if (!action) return null

  // Find the transition for this action
  const actionTransition = mockActionTransitions.find(
    (at) => at.action.id === actionId && at.transition.current_state.id === task.state.id,
  )

  if (!actionTransition) return null

  // Update the task state
  task.state = actionTransition.transition.next_state

  // Add to action logs
  const newLog = {
    id: Math.max(...task.action_logs.map((log: any) => log.id)) + 1,
    user: mockUser,
    action: action,
    timestamp: new Date().toISOString(),
  }

  task.action_logs.push(newLog)

  // Update available actions
  task.available_actions = getAvailableActions(task)

  return task
}

export const mockSentTasks = mockTasks.sent
export const mockReceivedTasks = mockTasks.received

export const mockTaskDetails = {
  5: {
    id: 5,
    title: "BT005",
    process: {
      name: "Maintenance Request",
    },
    status: "pending",
    created_by: "john_doe",
    action: "Approve",
    fields: [
      {
        field: {
          id: 17,
          name: "Property ID",
        },
        value: "Property-789",
      },
      {
        field: {
          id: 18,
          name: "Task Detail",
        },
        value: "Kitchen sink is clogged and needs to be fixed",
      },
      {
        field: {
          id: 19,
          name: "Required Completion Date",
        },
        value: "2023-05-18",
      },
      {
        field: {
          id: 20,
          name: "Priority",
        },
        value: "Medium",
      },
    ],
  },
  6: {
    id: 6,
    title: "BT006",
    process: {
      name: "Common Task",
    },
    status: "pending",
    created_by: "jane_smith",
    action: "Approve",
    fields: [
      {
        field: {
          id: 21,
          name: "Task Description",
        },
        value: "Review the quarterly report and provide feedback",
      },
      {
        field: {
          id: 22,
          name: "Due Date",
        },
        value: "2023-05-17",
      },
      {
        field: {
          id: 23,
          name: "Task Type",
        },
        value: "Review",
      },
    ],
  },
  7: {
    id: 7,
    title: "BT007",
    process: {
      name: "Purchase Request",
    },
    status: "working-on",
    created_by: "john_doe",
    action: "Complete",
    fields: [
      {
        field: {
          id: 24,
          name: "Item Description",
        },
        value: "New laptop for the development team",
      },
      {
        field: {
          id: 25,
          name: "Quantity",
        },
        value: "3",
      },
      {
        field: {
          id: 26,
          name: "Estimated Cost",
        },
        value: "4500",
      },
      {
        field: {
          id: 27,
          name: "Required By Date",
        },
        value: "2023-05-30",
      },
      {
        field: {
          id: 28,
          name: "Budget Code",
        },
        value: "BUD-2023-002",
      },
    ],
  },
}
