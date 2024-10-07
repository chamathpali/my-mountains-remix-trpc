import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { useEffect, useState } from 'react'
import { Search, Plus, MapPin, Calendar, BarChart2, Footprints, ArrowUpIcon, ArrowDownIcon, MinusIcon, Trash, Bot } from "lucide-react"
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import client from "~/trpcClient.server";
import { Form, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { MountainCardSkeleton } from "~/components/MountainCardSkeleton";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | My Mountains" },
    { name: "description", content: "Track your mountains!" },
  ];
};

export async function loader() {
  const mountains = await client.list.query();
  // console.log("loader", mountains)

  return json(mountains);
}

export default function Index() {
  const fetcher = useFetcher();
  const mountains = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [newMountain, setNewMountain] = useState<typeof mountains[number]>({ name: '', climbedAt: '', distance: 0, level: 5, location: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMountainSummary, setSelectedMountainSummary] = useState<string | boolean>(false);

  const actionData = useActionData<typeof action>();

  const filteredMountains = mountains.filter(mountain =>
    mountain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDistance = mountains.reduce((acc, mountain) => acc + mountain.distance, 0).toFixed(2);

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const { countLastYear, countThisYear } = mountains.reduce((counts, mountain) => {
    const climbedYear = new Date(mountain.climbedAt).getFullYear();
    
    if (climbedYear === lastYear) {
      counts.countLastYear++;
    } else if (climbedYear === currentYear) {
      counts.countThisYear++;
    }
    
    return counts;
  }, { countLastYear: 0, countThisYear: 0 });

  const difference = countThisYear - countLastYear;

  const handleAddMountain = () => {
    setNewMountain({ name: '', climbedAt: '', distance: 0, level: 5, location: '' });
    setIsDialogOpen(false);
  }

  useEffect(() => {
    if (actionData) {
      const message = actionData.status ? actionData.message : 'Something Went Wrong';
      alert(message);
    }

  }, [actionData])

  return (
    <div className="flex p-4 dark:bg-background">
      <div className="container mx-auto p-2">
        <h1 className="text-2xl font-bold ">My Mountain List ⛰️</h1>
        <p className="text-muted-foreground mb-4">Keep Track of the Mountains you have climbed!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          <Card className="w-full max-w-sm mx-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Last Year</p>
                  <p className="text-4xl font-bold text-muted-foreground">{countLastYear}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">This Year</p>
                  <p className="text-4xl font-bold">{countThisYear}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm inline-flex items-center" aria-live="polite">
                  {difference !== 0 && countLastYear !== 0 ? (
                    <>
                      {difference > 0 ? (
                        <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" aria-hidden="true" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" aria-hidden="true" />
                      )}
                      <span className={difference > 0 ? "text-green-500" : "text-red-500"}>
                        {countLastYear !== 0 ? (
                          `${Math.abs(Number(((difference / countLastYear) * 100).toFixed(1)))}% ${difference > 0 ? "increase" : "decrease"}`
                        ) : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <MinusIcon className="w-4 h-4 mr-1 text-gray-500" aria-hidden="true" />
                      <span>No change</span>
                    </>
                  )}
                </p>

              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Distance</CardDescription>
              <CardTitle className="text-4xl">{totalDistance} <span className="text-muted-foreground">km</span></CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Mountains</CardDescription>
              <CardTitle className="text-4xl">{mountains.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search mountains..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Mountain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Mountain</DialogTitle>
              </DialogHeader>
              <fetcher.Form method="POST" className="space-y-4" onSubmit={handleAddMountain}>
                <div>
                  <Label htmlFor="name">Mountain Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMountain.name}
                    onChange={(e) => setNewMountain({ ...newMountain, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance (in kilometers)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    value={newMountain.distance}
                    onChange={(e) => setNewMountain({ ...newMountain, distance: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newMountain.location}
                    onChange={(e) => setNewMountain({ ...newMountain, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="climbedAt">Date Climbed</Label>
                  <Input
                    id="climbedAt"
                    name="climbedAt"
                    type="date"
                    value={newMountain.climbedAt}
                    onChange={(e) => setNewMountain({ ...newMountain, climbedAt: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">Hardness Level (1-10)</Label>
                  <Input
                    id="level"
                    name="level"
                    type="number"
                    min={1}
                    max={10}
                    value={newMountain.level}
                    onChange={(e) => setNewMountain({ ...newMountain, level: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit">Add Mountain</Button>
              </fetcher.Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetcher.state === 'loading' || fetcher.state === 'submitting' ? <MountainCardSkeleton /> : null}

          {filteredMountains.map((mountain) => (
            <Card key={mountain.name} className="w-full max-w-md mx-auto">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">{mountain.name}</CardTitle>
                  <Button
                    variant="outline"
                    disabled={!mountain.genAISummary}
                    onClick={() => setSelectedMountainSummary(mountain.genAISummary ?? 'Unable to Generate Content for this Mountain!')}
                    size="icon"
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full p-2"
                  >
                    <Bot className="h-8 w-8" color="white" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Footprints className="text-gray-500" size={18} />
                  <span>{mountain.distance} km</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-gray-500" size={18} />
                  <span>{mountain.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-gray-500" size={18} />
                  <span>{mountain.climbedAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart2 className="text-gray-500" size={18} />
                  <span>Difficulty:</span>
                  <div >
                    {mountain.level}/10
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-xs">
                    Created at: {mountain.createdAt ? new Date(mountain.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }) : null}
                  </span>
                  <Form method="DELETE">
                    <input name="uuid" hidden value={mountain.uuid} />
                    {/* This is the SK for dynamoDB */}
                    <input name="metadata" hidden value={mountain.metadata} />
                    <Button type="submit" variant="ghost" size="icon">
                      <Trash className="h-4 w-4" color="red" />
                    </Button>
                  </Form>
                </div>
              </CardContent>
            </Card>

          ))}

          <Dialog open={!!selectedMountainSummary} onOpenChange={setSelectedMountainSummary}>
            <DialogContent>
              <DialogTitle className="flex items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white p-2 mt-2 rounded-md">
                <Bot className="h-8 w-8 mr-2" />AI Generated Summary </DialogTitle>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-[500px] overflow-y-auto generated-content ">
                <div className="dark:text-white" dangerouslySetInnerHTML={{ __html: selectedMountainSummary ? selectedMountainSummary : '' }}></div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {filteredMountains.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No mountains found.</p>
        )}
      </div>
    </div>
  )
}

export async function action({
  request,
}: ActionFunctionArgs) {

  if (request.method === "POST") {
    const formData = await request.formData();
    const name = formData.get("name")?.toString() ?? '';
    const distance = formData.get("distance")?.toString() ?? '';
    const location = formData.get("location")?.toString() ?? '';
    const level = formData.get("level")?.toString() ?? '';
    const climbedAt = formData.get("climbedAt")?.toString() ?? '';

    if (!name || !distance || !location || !climbedAt || !level) {
      return json({ message: "All fields are required", status: false }, { status: 400 });
    }

    return await client.add.query({ name, distance: parseFloat(distance), location, level: parseFloat(level), climbedAt })
  }

  if (request.method === "DELETE") {
    const formData = await request.formData();
    const uuid = formData.get('uuid')?.toString();
    const metadata = formData.get('metadata')?.toString();

    if (!uuid || !metadata) {
      return json({ message: "All fields are required", status: false }, { status: 400 });
    }

    return json(await client.delete.mutate({ uuid: uuid, metadata: metadata }));
  }
}
