# Agile Board Frontend

# Data Types

## Ticket

* TicketId: string
* TicketTitle: string
* TicketDescription: string
* TicketPic: string (url)
* StartDate: int64 (unix timestamp)
* EndDate: int64 (unix timestamp)
* Tags: Tag[]
* AssigneeId: string (User.UserId)
* Dependencies: string[] (Array of Ticket.TicketId)

## User

* UserId: string
* FirstName: string
* LastName: string
* UserPic: string (url)

## Project

* ProjectId: string
* ProjectName: string

## Column

* ColumnId: string
* ColumnName: string

## Tag

* TagId: string
* TagTitle: string
* TagColor: string (css class)

# Backend features and requirements

## GET GetProjects :: Project[]
Returns project list.

## GET GetColumnsByProject :: projectId:string -> Column[]
`/GetColumnsByProject?projectId=<projectId>`

Returns list of columns in project

## GET GetTicketsByColumn :: columnId:string -> Ticket[]
`/GetTicketsByColumn?columnId=<columnId>`

Return list of tickets in column

## POST SetColumnName :: columnId:string -> columnName:string -> bool
`/SetColumnName?columnId=<columnId>&columnName=<columnName>`

Sets column name. Returns true if save is successful, false otherwise.

## POST SetProjectName :: projectId:string -> projectName:string -> bool
`/SetProjectName?projectId=<projectId>&projectName=<projectName>`

Sets project name. Returns true if save is successful, false otherwise.

## POST MoveTicketToColumn :: fromColumnId:string -> toColumnId:string -> ticketId:string -> index:int -> bool
`/MoveTicketToColumn?fromColumnId=<...>&toColumnId=<...>&ticketId=<...>&index=<...>`

Moves ticket to specified column and places it in specified index. Indices are zero-based.

## POST AddNewColumn :: projectId:string -> Column
`/AddNewColumn?projectId=<...>`

Creates new column in specified project with default name and returns it.

## POST AddNewProject :: Project
`/AddNewPoject`

Creates new project with default project name and returns it.

## GET LoadAllUsers :: User[]
`/LoadAllUsers`

Returns all users in system.

## GET LoadCurrentUser :: User
`/LoadCurrentUser`

Returns current user.

## POST SaveTicket :: Ticket (POST body) -> Ticket
`/SaveTicket`

Saves ticket and returns saved ticked. If save is unsuccessful returns the same ticket.

## POST AddTicket :: columnId:string -> Ticket
`/AddTicket?columnId=<...>`

Creates new ticket in specified column with default values and returns it.

POST SaveUser :: User (POST body) -> User
`/SaveUser`

Saves new user in system.
Returns null if there is already user with such UserId