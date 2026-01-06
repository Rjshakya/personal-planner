"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface TimetableEvent {
  id: string;
  day: string;
  time: string;
  title: string;
  description?: string;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

export const Timetable = () => {
  const [events, setEvents] = useState<TimetableEvent[]>([
    {
      id: "1",
      day: "Mon",
      time: "9:00 AM",
      title: "Meeting",
      description: "Team standup",
    },
    {
      id: "2",
      day: "Wed",
      time: "2:00 PM",
      title: "Workout",
      description: "Gym session",
    },
    {
      id: "3",
      day: "Fri",
      time: "5:00 PM",
      title: "Dinner",
      description: "With friends",
    },
  ]);

  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [idCounter, setIdCounter] = useState(4);

  const addEvent = () => {
    if (!newDay || !newTime || !newTitle.trim()) return;
    const newEvent: TimetableEvent = {
      id: idCounter.toString(),
      day: newDay,
      time: newTime,
      title: newTitle,
      description: newDescription,
    };
    setEvents([...events, newEvent]);
    setIdCounter(idCounter + 1);
    resetForm();
  };

  const resetForm = () => {
    setNewDay("");
    setNewTime("");
    setNewTitle("");
    setNewDescription("");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const startEdit = (event: TimetableEvent) => {
    setEditingEvent({ ...event });
  };

  const saveEdit = () => {
    if (!editingEvent) return;
    setEvents(
      events.map((event) =>
        event.id === editingEvent.id ? editingEvent : event
      )
    );
    setEditingEvent(null);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-8 gap-1 text-sm">
          {/* Header row */}
          <div className="font-medium p-2 text-center"></div>
          {days.map((day) => (
            <div key={day} className="font-medium p-2 text-center border-b">
              {day}
            </div>
          ))}

          {/* Time rows */}
          {times.map((time) => (
            <div key={time} className="contents">
              <div className="font-medium p-2 text-right border-r">{time}</div>
              {days.map((day) => {
                const event = events.find(
                  (e) => e.day === day && e.time === time
                );
                return (
                  <div
                    key={`${day}-${time}`}
                    className={cn(
                      "p-2 border-b border-r min-h-12 flex flex-col justify-center cursor-pointer hover:bg-muted/50 transition-colors",
                      event ? "bg-muted" : "bg-background"
                    )}
                    onClick={() => event && startEdit(event)}
                  >
                    {event && (
                      <>
                        <div className="font-medium text-xs">{event.title}</div>
                        {event.description && (
                          <div className="text-muted-foreground text-xs">
                            {event.description}
                          </div>
                        )}
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(event);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <Edit2 className="h-2 w-2" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEvent(event.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-2 w-2" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Add Event Form */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <h3 className="font-medium">Add New Event</h3>
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={newDay}
              onValueChange={(value) => setNewDay(value || "")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newTime}
              onValueChange={(value) => setNewTime(value || "")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {times.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Event title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Button onClick={addEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Edit Event Form */}
        {editingEvent && (
          <div className="grid gap-2 p-4 border rounded-lg bg-muted/20">
            <h3 className="font-medium">Edit Event</h3>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={editingEvent.day}
                onValueChange={(value) =>
                  setEditingEvent({ ...editingEvent, day: value || "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={editingEvent.time}
                onValueChange={(value) =>
                  setEditingEvent({ ...editingEvent, time: value || "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
            />
            <Input
              value={editingEvent.description || ""}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button onClick={saveEdit}>
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={cancelEdit} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
