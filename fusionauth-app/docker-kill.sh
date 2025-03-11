#!/opt/homebrew/bin/bash

# Script to kill Docker containers
# Usage: ./docker-kill.sh [container_id_or_name]

# Function to display usage
show_usage() {
  echo "Docker Container Kill Script"
  echo "Usage:"
  echo "  ./docker-kill.sh                  - Interactive mode, select containers to kill"
  echo "  ./docker-kill.sh container_id     - Kill specific container by ID or name"
  echo "  ./docker-kill.sh -a               - Kill all running containers"
}

# Function to kill a container
kill_container() {
  local container_id=$1
  echo "Killing container: $container_id"
  docker kill "$container_id"
  return $?
}

# If no arguments provided, show interactive selection
if [ $# -eq 0 ]; then
  # Check if there are any running containers
  if [ -z "$(docker ps -q)" ]; then
    echo "No running containers found."
    exit 0
  fi

  # Display running containers with numbers
  echo "Running containers:"
  echo "------------------"

  # Create an array of container IDs
  mapfile -t container_ids < <(docker ps -q)

  # Display containers with index numbers
  i=1
  docker ps --format "[$i] {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}" | nl -v 1 -w 2 -s ') '

  # Prompt user to select containers to kill
  echo
  echo "Enter container numbers to kill (space-separated), or 'all' for all containers:"
  read -r selection

  # Process selection
  if [ "$selection" == "all" ]; then
    for id in "${container_ids[@]}"; do
      kill_container "$id"
    done
  else
    # Convert selection to array
    read -ra selected_indices <<< "$selection"

    # Kill selected containers
    for index in "${selected_indices[@]}"; do
      if [ "$index" -gt 0 ] && [ "$index" -le "${#container_ids[@]}" ]; then
        container_id="${container_ids[$((index-1))]}"
        kill_container "$container_id"
      else
        echo "Invalid selection: $index"
      fi
    done
  fi

# Kill all running containers
elif [ "$1" == "-a" ]; then
  container_ids=$(docker ps -q)
  if [ -z "$container_ids" ]; then
    echo "No running containers found."
    exit 0
  fi

  echo "Killing all running containers..."
  for id in $container_ids; do
    kill_container "$id"
  done

# Show help
elif [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  show_usage

# Kill specific container by ID or name
else
  container_id=$1
  # Check if container exists
  if docker ps -q --filter "id=$container_id" | grep -q .; then
    kill_container "$container_id"
  elif docker ps -q --filter "name=$container_id" | grep -q .; then
    # If provided with name instead of ID, get the ID first
    actual_id=$(docker ps -q --filter "name=$container_id" | head -n 1)
    kill_container "$actual_id"
  else
    echo "Container not found: $container_id"
    echo "Running containers:"
    docker ps
    exit 1
  fi
fi

echo "Done."
