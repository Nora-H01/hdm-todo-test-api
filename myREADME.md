# Backend

J’ai décidé de travailler fichier par fichier en voyant les tâches qu’il y avait à faire.

## Ordre de travail

### 1. TaskRepository.ts
J’ai regardé le `@todo IMPLEMENT HERE USING PRISMA API`, puis le reste du code pour m’inspirer pour la base… 
J’avais initialement ceci :

```typescript
return this.prisma.task.create({
        data: data,
      });
```

Mais cela m’affichait une erreur de typage, donc j’ai décidé d’utiliser un alias `AS` en reprenant la ligne qui concernait la fonction `create` avec Prisma pour que le typage soit reconnu :

```typescript
return this.prisma.task.create({
        data: data as Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>,
      });
```

J’ai procédé de la même manière pour la suite.

### 2. saveTaskUseCase.ts
J’ai mis une validation de type `trim()` qui va vérifier si le paramètre `name` n’est pas vide, sinon cela avertit l’utilisateur que le champ est vide.

Ensuite, j’ai ajouté l’enregistrement de la tâche dans la base de données avec `.save(dto)`.

Enfin, j’ai intégré une gestion des erreurs en cas de problème lors de l’enregistrement par l’utilisateur.

### 3. TaskController.ts
J’ai regardé les `@todo` à faire et analysé comment étaient agencés les autres endpoints. 

J’ai donc créé un `useCase` qui appelle `SaveTaskUseCase` pour être mis à jour, ainsi qu’un `handle(...)` pour appliquer la mise à jour avec les bonnes données :

```typescript
@Post('/tasks')
  async create(@Body() dto: SaveTaskDto) {
    // @todo YOU MUST FOLLOW THE SAME IMPLEMENTATION AS OTHER ENDPOINTS
    return (await this.useCaseFactory.create(SaveTaskUseCase)).handle(dto); 
  }
```

### 4. UseCaseFactory.ts
C’est le fichier qui centralise les informations, donc il a fallu le mettre à jour pour que les fonctions soient bien utilisables dans `TaskController.ts` :

```typescript
type UseCases = GetAllTasksUseCase | DeleteTask | SaveTaskUseCase;
```

---

## BONUS

En bonus, j’ai décidé de rajouter une gestion du statut de la tâche : `To do`, `In progress`, `Finished`.

### 1. Mise à jour de Prisma
J’ai dû me documenter sur Prisma et ajouter le statut au `schema.prisma` avec une valeur par défaut :

```prisma
status    String   @default("to do")
```

Puis, pour mettre à jour la base de données, j’ai utilisé les commandes :

```bash
yarn prisma:generate
```

et

```bash
yarn prisma:migrate:run
```

### 2. Mise à jour de SaveTaskDto.ts
J’ai ajouté le `status` pour savoir où en est la tâche. Je l’ai mis en `string`.
