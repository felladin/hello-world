/**
 * Vacation Schedule Overview Component
 * Author: felladin
 * Created: 2025-08-21 08:29:03
 * Purpose: Interactive vacation schedule for ServiceNow Workspace
 */

import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './vacation-schedule-overview.scss';

const { COMPONENT_RENDERED } = actionTypes;

// Action types
const LOAD_USERS = 'LOAD_USERS';
const LOAD_VACATIONS = 'LOAD_VACATIONS';
const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'REMOVE_USER';
const ADD_VACATION = 'ADD_VACATION';
const DELETE_VACATION = 'DELETE_VACATION';
const SET_VIEW_MODE = 'SET_VIEW_MODE';
const SET_CURRENT_DATE = 'SET_CURRENT_DATE';
const TOGGLE_ADD_USER_MODAL = 'TOGGLE_ADD_USER_MODAL';
const TOGGLE_ADD_VACATION_MODAL = 'TOGGLE_ADD_VACATION_MODAL';
const SET_SELECTED_USER = 'SET_SELECTED_USER';

// Color palette for vacation markers
const VACATION_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#A55EEA', '#26DE81', '#FD79A8', '#6C5CE7', '#A29BFE'
];

// Create the component
createCustomElement('vacation-schedule-overview', {
    renderer: { type: snabbdom },
    
    // Initial state
    initialState: {
        users: [],
        vacations: [],
        currentDate: new Date(),
        viewMode: 'month', // month, quarter, year
        showAddUserModal: false,
        showAddVacationModal: false,
        selectedUser: null,
        availableUsers: [],
        loading: false,
        error: null
    },

    // Action handlers
    actionHandlers: {
        [COMPONENT_RENDERED]: (coeffects) => {
            const { dispatch, properties } = coeffects;
            
            return [
                dispatch(LOAD_USERS),
                dispatch(LOAD_VACATIONS),
                dispatch(SET_VIEW_MODE, properties.defaultViewMode || 'month')
            ];
        },

        [LOAD_USERS]: createHttpEffect('/api/now/table/sys_user', {
            method: 'GET',
            queryParams: {
                sysparm_fields: 'sys_id,name,email,user_name,avatar',
                sysparm_query: 'active=true^user_nameISNOTEMPTY',
                sysparm_limit: 1000
            },
            successActionType: 'LOAD_USERS_SUCCESS',
            errorActionType: 'LOAD_USERS_ERROR'
        }),

        'LOAD_USERS_SUCCESS': (coeffects) => {
            const { action, updateState } = coeffects;
            const users = action.payload.result || [];
            
            return updateState({
                availableUsers: users,
                loading: false
            });
        },

        [LOAD_VACATIONS]: createHttpEffect('/api/now/table/u_vacation_schedule', {
            method: 'GET',
            queryParams: {
                sysparm_fields: 'sys_id,u_user,u_start_date,u_end_date,u_description,u_user.name,u_user.user_name',
                sysparm_query: 'u_start_date>=javascript:gs.dateGenerate(new Date().getFullYear(),0,1)^u_end_date<=javascript:gs.dateGenerate(new Date().getFullYear(),11,31)'
            },
            successActionType: 'LOAD_VACATIONS_SUCCESS',
            errorActionType: 'LOAD_VACATIONS_ERROR'
        }),

        'LOAD_VACATIONS_SUCCESS': (coeffects) => {
            const { action, updateState } = coeffects;
            const vacations = action.payload.result || [];
            
            // Process and group vacations by user
            const processedVacations = vacations.map(vacation => ({
                ...vacation,
                startDate: new Date(vacation.u_start_date),
                endDate: new Date(vacation.u_end_date),
                userId: vacation.u_user.value,
                userName: vacation.u_user.display_value
            }));

            return updateState({
                vacations: processedVacations,
                loading: false
            });
        },

        [ADD_USER]: (coeffects) => {
            const { action, state, updateState } = coeffects;
            const { userId } = action.payload;
            
            const userToAdd = state.availableUsers.find(u => u.sys_id === userId);
            if (userToAdd && !state.users.find(u => u.sys_id === userId)) {
                const newUsers = [...state.users, {
                    ...userToAdd,
                    color: VACATION_COLORS[state.users.length % VACATION_COLORS.length]
                }];
                
                return updateState({
                    users: newUsers,
                    showAddUserModal: false
                });
            }
            
            return updateState({ showAddUserModal: false });
        },

        [REMOVE_USER]: (coeffects) => {
            const { action, state, updateState } = coeffects;
            const { userId } = action.payload;
            
            const newUsers = state.users.filter(u => u.sys_id !== userId);
            const newVacations = state.vacations.filter(v => v.userId !== userId);
            
            return updateState({
                users: newUsers,
                vacations: newVacations
            });
        },

        [ADD_VACATION]: createHttpEffect('/api/now/table/u_vacation_schedule', {
            method: 'POST',
            dataParam: 'payload.vacationData',
            successActionType: 'ADD_VACATION_SUCCESS',
            errorActionType: 'ADD_VACATION_ERROR'
        }),

        'ADD_VACATION_SUCCESS': (coeffects) => {
            const { dispatch, updateState } = coeffects;
            
            return [
                updateState({ showAddVacationModal: false }),
                dispatch(LOAD_VACATIONS)
            ];
        },

        [SET_VIEW_MODE]: (coeffects) => {
            const { action, updateState } = coeffects;
            return updateState({ viewMode: action.payload });
        },

        [SET_CURRENT_DATE]: (coeffects) => {
            const { action, updateState } = coeffects;
            return updateState({ currentDate: new Date(action.payload) });
        },

        [TOGGLE_ADD_USER_MODAL]: (coeffects) => {
            const { state, updateState } = coeffects;
            return updateState({ showAddUserModal: !state.showAddUserModal });
        },

        [TOGGLE_ADD_VACATION_MODAL]: (coeffects) => {
            const { action, state, updateState } = coeffects;
            const { userId } = action.payload || {};
            
            return updateState({ 
                showAddVacationModal: !state.showAddVacationModal,
                selectedUser: userId || null
            });
        }
    },

    // View function
    view: (state, { dispatch, properties }) => {
        const {
            users,
            vacations,
            currentDate,
            viewMode,
            showAddUserModal,
            showAddVacationModal,
            availableUsers,
            loading,
            error
        } = state;

        return (
            <div className="vacation-schedule-container">
                <div className="vacation-schedule-header">
                    <h2 className="schedule-title">{properties.title}</h2>
                    <div className="header-controls">
                        <div className="view-mode-selector">
                            <button 
                                className={viewMode === 'month' ? 'active' : ''}
                                on-click={() => dispatch(SET_VIEW_MODE, 'month')}
                            >
                                Month
                            </button>
                            <button 
                                className={viewMode === 'quarter' ? 'active' : ''}
                                on-click={() => dispatch(SET_VIEW_MODE, 'quarter')}
                            >
                                Quarter
                            </button>
                            <button 
                                className={viewMode === 'year' ? 'active' : ''}
                                on-click={() => dispatch(SET_VIEW_MODE, 'year')}
                            >
                                Year
                            </button>
                        </div>
                        <button 
                            className="add-user-btn primary"
                            on-click={() => dispatch(TOGGLE_ADD_USER_MODAL)}
                        >
                            + Add Team Member
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        Error: {error}
                    </div>
                )}

                {loading && (
                    <div className="loading-indicator">
                        Loading vacation data...
                    </div>
                )}

                <div className="schedule-content">
                    {renderUsersList(users, dispatch, properties)}
                    {renderCalendar(currentDate, viewMode, users, vacations, dispatch)}
                </div>

                {showAddUserModal && renderAddUserModal(availableUsers, users, dispatch)}
                {showAddVacationModal && renderAddVacationModal(users, state, dispatch)}
            </div>
        );
    }
});

// Helper function to render users list
function renderUsersList(users, dispatch, properties) {
    return (
        <div className="users-list">
            <h3>Team Members ({users.length})</h3>
            <div className="users-grid">
                {users.map(user => (
                    <div key={user.sys_id} className="user-card">
                        <div 
                            className="user-color-indicator" 
                            style={`background-color: ${user.color}`}
                        ></div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                        <div className="user-actions">
                            {properties.allowUserSelfService && (
                                <button 
                                    className="add-vacation-btn"
                                    on-click={() => dispatch(TOGGLE_ADD_VACATION_MODAL, { userId: user.sys_id })}
                                    title="Add vacation for this user"
                                >
                                    📅
                                </button>
                            )}
                            <button 
                                className="remove-user-btn"
                                on-click={() => dispatch(REMOVE_USER, { userId: user.sys_id })}
                                title="Remove user from schedule"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper function to render calendar
function renderCalendar(currentDate, viewMode, users, vacations, dispatch) {
    const calendarData = generateCalendarData(currentDate, viewMode, users, vacations);
    
    return (
        <div className="calendar-container">
            <div className="calendar-navigation">
                <button 
                    on-click={() => dispatch(SET_CURRENT_DATE, getPreviousPeriod(currentDate, viewMode))}
                >
                    ← Previous
                </button>
                <h3 className="calendar-title">
                    {formatCalendarTitle(currentDate, viewMode)}
                </h3>
                <button 
                    on-click={() => dispatch(SET_CURRENT_DATE, getNextPeriod(currentDate, viewMode))}
                >
                    Next →
                </button>
            </div>
            
            <div className={`calendar-grid ${viewMode}`}>
                {renderCalendarHeader(viewMode)}
                {renderCalendarBody(calendarData, users, vacations)}
            </div>
        </div>
    );
}

// Helper function to render add user modal
function renderAddUserModal(availableUsers, currentUsers, dispatch) {
    const filteredUsers = availableUsers.filter(user => 
        !currentUsers.find(cu => cu.sys_id === user.sys_id)
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add Team Member</h3>
                    <button 
                        className="close-btn"
                        on-click={() => dispatch(TOGGLE_ADD_USER_MODAL)}
                    >
                        ✕
                    </button>
                </div>
                <div className="modal-body">
                    <div className="user-search">
                        <input 
                            type="text" 
                            placeholder="Search users..."
                            className="search-input"
                        />
                    </div>
                    <div className="available-users-list">
                        {filteredUsers.slice(0, 50).map(user => (
                            <div 
                                key={user.sys_id} 
                                className="available-user-item"
                                on-click={() => dispatch(ADD_USER, { userId: user.sys_id })}
                            >
                                <span className="user-name">{user.name}</span>
                                <span className="user-username">({user.user_name})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to render add vacation modal
function renderAddVacationModal(users, state, dispatch) {
    const { selectedUser } = state;
    const user = users.find(u => u.sys_id === selectedUser);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add Vacation Period</h3>
                    <button 
                        className="close-btn"
                        on-click={() => dispatch(TOGGLE_ADD_VACATION_MODAL)}
                    >
                        ✕
                    </button>
                </div>
                <div className="modal-body">
                    <form 
                        className="vacation-form"
                        on-submit={(e) => handleVacationSubmit(e, dispatch, selectedUser)}
                    >
                        <div className="form-group">
                            <label>User:</label>
                            <select name="userId" required>
                                {selectedUser && (
                                    <option value={selectedUser} selected>
                                        {user?.name}
                                    </option>
                                )}
                                {!selectedUser && users.map(u => (
                                    <option key={u.sys_id} value={u.sys_id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Start Date:</label>
                            <input type="date" name="startDate" required />
                        </div>
                        
                        <div className="form-group">
                            <label>End Date:</label>
                            <input type="date" name="endDate" required />
                        </div>
                        
                        <div className="form-group">
                            <label>Description:</label>
                            <input 
                                type="text" 
                                name="description" 
                                placeholder="Vacation, Personal time, etc."
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="primary">
                                Add Vacation
                            </button>
                            <button 
                                type="button"
                                on-click={() => dispatch(TOGGLE_ADD_VACATION_MODAL)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Utility functions
function generateCalendarData(currentDate, viewMode, users, vacations) {
    // Implementation for generating calendar data based on view mode
    // Returns structured data for rendering calendar grid
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    switch (viewMode) {
        case 'month':
            return generateMonthData(year, month, users, vacations);
        case 'quarter':
            return generateQuarterData(year, Math.floor(month / 3), users, vacations);
        case 'year':
            return generateYearData(year, users, vacations);
        default:
            return generateMonthData(year, month, users, vacations);
    }
}

function generateMonthData(year, month, users, vacations) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push({ isEmpty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayVacations = vacations.filter(vacation => 
            date >= vacation.startDate && date <= vacation.endDate
        );
        
        days.push({
            date: day,
            fullDate: date,
            vacations: dayVacations,
            isToday: isToday(date)
        });
    }
    
    return { days, type: 'month' };
}

function generateQuarterData(year, quarter, users, vacations) {
    const startMonth = quarter * 3;
    const months = [];
    
    for (let i = 0; i < 3; i++) {
        months.push(generateMonthData(year, startMonth + i, users, vacations));
    }
    
    return { months, type: 'quarter' };
}

function generateYearData(year, users, vacations) {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
        months.push(generateMonthData(year, month, users, vacations));
    }
    
    return { months, type: 'year' };
}

function handleVacationSubmit(event, dispatch, selectedUser) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const vacationData = {
        u_user: formData.get('userId') || selectedUser,
        u_start_date: formData.get('startDate'),
        u_end_date: formData.get('endDate'),
        u_description: formData.get('description') || 'Vacation'
    };
    
    dispatch(ADD_VACATION, { vacationData });
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function formatCalendarTitle(date, viewMode) {
    const options = { year: 'numeric', month: 'long' };
    
    switch (viewMode) {
        case 'month':
            return date.toLocaleDateString('en-US', options);
        case 'quarter':
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            return `Q${quarter} ${date.getFullYear()}`;
        case 'year':
            return date.getFullYear().toString();
        default:
            return date.toLocaleDateString('en-US', options);
    }
}

function getPreviousPeriod(date, viewMode) {
    const newDate = new Date(date);
    
    switch (viewMode) {
        case 'month':
            newDate.setMonth(newDate.getMonth() - 1);
            break;
        case 'quarter':
            newDate.setMonth(newDate.getMonth() - 3);
            break;
        case 'year':
            newDate.setFullYear(newDate.getFullYear() - 1);
            break;
    }
    
    return newDate;
}

function getNextPeriod(date, viewMode) {
    const newDate = new Date(date);
    
    switch (viewMode) {
        case 'month':
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        case 'quarter':
            newDate.setMonth(newDate.getMonth() + 3);
            break;
        case 'year':
            newDate.setFullYear(newDate.getFullYear() + 1);
            break;
    }
    
    return newDate;
}

function renderCalendarHeader(viewMode) {
    if (viewMode === 'month') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays.map(day => (
            <div key={day} className="calendar-header-cell">
                {day}
            </div>
        ));
    }
    return null;
}

function renderCalendarBody(calendarData, users, vacations) {
    if (calendarData.type === 'month') {
        return calendarData.days.map((day, index) => {
            if (day.isEmpty) {
                return <div key={index} className="calendar-cell empty"></div>;
            }
            
            return (
                <div 
                    key={day.date} 
                    className={`calendar-cell ${day.isToday ? 'today' : ''}`}
                >
                    <div className="date-number">{day.date}</div>
                    <div className="vacation-indicators">
                        {day.vacations.map(vacation => {
                            const user = users.find(u => u.sys_id === vacation.userId);
                            return user ? (
                                <div 
                                    key={vacation.sys_id}
                                    className="vacation-marker"
                                    style={`background-color: ${user.color}`}
                                    title={`${user.name}: ${vacation.u_description}`}
                                >
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
            );
        });
    }
    
    // Handle quarter and year views
    return null;
}

export default 'vacation-schedule-overview';
