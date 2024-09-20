import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { useState } from 'react'
import { Search, Plus, MapPin, Calendar, BarChart2, Footprints } from "lucide-react"
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import client from "~/trpcClient.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { MountainCardSkeleton } from "~/components/MountainCardSkeleton";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | My Mountains" },
    { name: "description", content: "Track your mountains!" },
  ];
};

export async function loader() {
  const mountains = await client.list.query();
  console.log("loader", mountains)

  return json(mountains);
}

export default function Index() {
  const fetcher = useFetcher();
  const mountains = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [newMountain, setNewMountain] = useState<typeof mountains[number]>({ name: '', climbedAt: '', distance: 0, level: 5, location: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredMountains = mountains.filter(mountain =>
    mountain.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const handleAddMountain = () => {
    setNewMountain({ name: '', climbedAt: '', distance: 0, level: 5, location: '' });
    setIsDialogOpen(false);
  }

  return (
    <div className="flex h-screen p-4 dark:bg-background">
      <div className="container mx-auto p-2">
        <h1 className="text-2xl font-bold ">My Mountain List ⛰️</h1>
        <p className="text-muted-foreground mb-4">Keep Track of the Mountains you have climbed!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          <Card>
            <CardHeader>
              <CardDescription>Total Climbed</CardDescription>
              <CardTitle className="text-4xl">20.4 <span className="text-muted-foreground">km</span></CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Mountains</CardDescription>
              <CardTitle className="text-4xl">20</CardTitle>
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
              </CardContent>
            </Card>

          ))}
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
  const formData = await request.formData();

  const name = formData.get("name")?.toString() ?? '';
  const distance = formData.get("distance")?.toString() ?? '';
  const location = formData.get("location")?.toString() ?? '';
  const level = formData.get("level")?.toString() ?? '';
  const climbedAt = formData.get("climbedAt")?.toString() ?? '';

  if (!name || !distance || !location || !climbedAt || !level) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  await client.add.query({ name, distance: parseFloat(distance), location, level: parseFloat(level), climbedAt })

  return json({ ok: true });
}
