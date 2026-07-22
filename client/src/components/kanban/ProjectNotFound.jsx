import { LayoutGrid } from "lucide-react";

const ProjectNotFound = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <LayoutGrid size={32} className="text-gray-700 mx-auto mb-3" />
      <p className="text-gray-400 font-medium">Project not found</p>
    </div>
  </div>
);

export default ProjectNotFound;